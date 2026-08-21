import { spawn } from "node:child_process";
import { once } from "node:events";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const outputDirectory = join(repositoryRoot, "docs/assets/result-examples");
const width = 390;
const height = 844;
const deviceScaleFactor = 2;
const targets = [
  {
    id: "01-weekend-activities",
    url: "http://127.0.0.1:4171/",
    prepare: `
      localStorage.removeItem("course.weekend.saved.v1");
      document.querySelector('[aria-label="동네 독립서점 산책 저장"]')?.click();
    `,
    ready: ".weekend-count b",
  },
  {
    id: "02-habit-challenge",
    url: "http://127.0.0.1:4172/",
    prepare: `
      localStorage.removeItem("course.habit.v1");
      [...document.querySelectorAll("button")]
        .find((button) => button.textContent?.includes("3일 예시 채우기"))
        ?.click();
    `,
    ready: ".week-day.done",
  },
  {
    id: "03-travel-style-test",
    url: "http://127.0.0.1:4173/",
    prepare: `
      [...document.querySelectorAll("button")]
        .find((button) => button.textContent?.includes("여행 스타일 알아보기"))
        ?.click();
      for (let index = 0; index < 6; index += 1) {
        await new Promise((resolve) => setTimeout(resolve, 80));
        document.querySelectorAll(".quiz-choice")[2]?.click();
      }
    `,
    ready: ".quiz-result",
  },
  {
    id: "04-gift-finder",
    url: "http://127.0.0.1:4174/",
    prepare: `
      [...document.querySelectorAll("button")]
        .find((button) => button.textContent?.includes("선물 추천받기"))
        ?.click();
    `,
    ready: ".gift-results",
  },
];

const sleep = (milliseconds) =>
  new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));

async function firstExecutable(paths) {
  for (const path of paths.filter(Boolean)) {
    try {
      await access(path);
      return path;
    } catch {
      // Continue through known Chrome locations.
    }
  }
  throw new Error(
    "Chrome executable not found. Set CHROME_PATH to a local Chrome or Chromium binary.",
  );
}

async function chromePath() {
  return firstExecutable([
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    process.env.PROGRAMFILES &&
      join(process.env.PROGRAMFILES, "Google/Chrome/Application/chrome.exe"),
  ]);
}

async function waitForDevTools(profileDirectory) {
  const path = join(profileDirectory, "DevToolsActivePort");
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const [port] = (await readFile(path, "utf8")).trim().split("\n");
      return Number(port);
    } catch {
      await sleep(50);
    }
  }
  throw new Error("Chrome DevTools endpoint did not become ready.");
}

async function connect(url) {
  const socket = new WebSocket(url);
  const pending = new Map();
  let nextId = 0;
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(String(event.data));
    if (!message.id || !pending.has(message.id)) return;
    const { resolveResponse, rejectResponse } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) rejectResponse(new Error(message.error.message));
    else resolveResponse(message.result);
  });
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener("open", resolveOpen, { once: true });
    socket.addEventListener("error", rejectOpen, { once: true });
  });
  return {
    close: () => socket.close(),
    send(method, params = {}) {
      const id = (nextId += 1);
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolveResponse, rejectResponse) => {
        pending.set(id, { resolveResponse, rejectResponse });
      });
    },
  };
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    awaitPromise: true,
    expression,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(
      result.exceptionDetails.text ?? "Browser evaluation failed.",
    );
  }
  return result.result?.value;
}

async function waitForSelector(client, selector) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (
      await evaluate(
        client,
        `Boolean(document.querySelector(${JSON.stringify(selector)}))`,
      )
    ) {
      return;
    }
    await sleep(50);
  }
  throw new Error(`Timed out waiting for ${selector}`);
}

async function capture(target, executable) {
  await fetch(target.url, { signal: AbortSignal.timeout(2_000) });
  const profileDirectory = await mkdtemp(join(tmpdir(), `aiers-${target.id}-`));
  const browser = spawn(
    executable,
    [
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${profileDirectory}`,
      "--disable-background-networking",
      "--disable-default-apps",
      "--disable-extensions",
      "--hide-scrollbars",
      "--no-first-run",
      "about:blank",
    ],
    { stdio: "ignore" },
  );
  let client;
  try {
    const port = await waitForDevTools(profileDirectory);
    const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then(
      (response) => response.json(),
    );
    const page = pages.find((candidate) => candidate.type === "page");
    if (!page?.webSocketDebuggerUrl)
      throw new Error("Chrome page target not found.");
    client = await connect(page.webSocketDebuggerUrl);
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      deviceScaleFactor,
      height,
      mobile: true,
      screenHeight: height,
      screenWidth: width,
      width,
    });
    await client.send("Page.navigate", { url: target.url });
    await waitForSelector(client, ".app-shell");
    await evaluate(client, "document.fonts.ready");
    await evaluate(
      client,
      `(async () => { ${target.prepare} await new Promise((resolve) => setTimeout(resolve, 240)); })()`,
    );
    await waitForSelector(client, target.ready);
    await evaluate(
      client,
      `(() => {
        window.scrollTo(0, 0);
        [...document.querySelectorAll("button")]
          .filter((button) => button.textContent?.trim() === "AIT")
          .forEach((button) => { button.style.display = "none"; });
      })()`,
    );
    const screenshot = await client.send("Page.captureScreenshot", {
      captureBeyondViewport: false,
      format: "png",
      fromSurface: true,
    });
    const path = join(outputDirectory, `${target.id}.png`);
    await writeFile(path, Buffer.from(screenshot.data, "base64"));
    console.log(
      `[CAPTURED] ${target.id} ${width}x${height}@${deviceScaleFactor}x`,
    );
  } finally {
    client?.close();
    if (browser.exitCode === null && browser.signalCode === null) {
      const closed = once(browser, "close");
      browser.kill("SIGTERM");
      await closed;
    }
    await rm(profileDirectory, { force: true, recursive: true });
  }
}

const executable = await chromePath();
for (const target of targets) await capture(target, executable);
