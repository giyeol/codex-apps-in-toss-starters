import {
  loadFullScreenAd,
  showFullScreenAd,
} from "@apps-in-toss/web-framework";
import { Button } from "@toss/tds-mobile";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { Icon } from "../../ui/Icon";

const TEST_AD_GROUP_ID = "ait-ad-test-interstitial-id";
const LOAD_TIMEOUT_MS = 8_000;
const SHOW_TIMEOUT_MS = 15_000;
type Status =
  "idle" | "loading" | "ready" | "showing" | "unsupported" | "failed";

export function TestAdPanel() {
  const [status, setStatus] = useState<Status>("idle");
  const loadSubscription = useRef<(() => void) | null>(null);
  const showSubscription = useRef<(() => void) | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsubscribe = (subscription: MutableRefObject<(() => void) | null>) => {
    try {
      subscription.current?.();
    } catch {
      /* cleanup cannot block the app */
    }
    subscription.current = null;
  };
  const cleanupLoad = () => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = null;
    unsubscribe(loadSubscription);
  };
  const cleanupAll = () => {
    cleanupLoad();
    if (showTimeout.current) clearTimeout(showTimeout.current);
    showTimeout.current = null;
    unsubscribe(showSubscription);
  };
  // The subscriptions are held in refs; this unmount-only cleanup must use the
  // latest ref values rather than re-subscribe when render callbacks change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cleanupAll, []);
  const load = () => {
    cleanupAll();
    try {
      if (!loadFullScreenAd.isSupported()) {
        setStatus("unsupported");
        return;
      }
      setStatus("loading");
      timeout.current = setTimeout(() => {
        cleanupLoad();
        setStatus("failed");
      }, LOAD_TIMEOUT_MS);
      loadSubscription.current = loadFullScreenAd({
        options: { adGroupId: TEST_AD_GROUP_ID },
        onEvent: (event) => {
          if (event.type === "loaded") {
            cleanupLoad();
            setStatus("ready");
          }
        },
        onError: () => {
          cleanupLoad();
          setStatus("failed");
        },
      });
    } catch {
      cleanupAll();
      setStatus("failed");
    }
  };
  const show = () => {
    if (status !== "ready") return;
    try {
      cleanupLoad();
      if (!showFullScreenAd.isSupported()) {
        setStatus("unsupported");
        return;
      }
      setStatus("showing");
      showTimeout.current = setTimeout(() => {
        cleanupAll();
        setStatus("failed");
      }, SHOW_TIMEOUT_MS);
      showSubscription.current = showFullScreenAd({
        options: { adGroupId: TEST_AD_GROUP_ID },
        onEvent: (event) => {
          if (event.type === "dismissed") {
            cleanupAll();
            setStatus("idle");
          }
          if (event.type === "failedToShow") {
            cleanupAll();
            setStatus("failed");
          }
        },
        onError: () => {
          cleanupAll();
          setStatus("failed");
        },
      });
    } catch {
      cleanupAll();
      setStatus("failed");
    }
  };
  return (
    <footer className="course-footer">
      <details className="ad-demo">
        <summary>
          <span className="ad-summary-icon" aria-hidden="true">
            <Icon name="ad" size={18} />
          </span>
          <span className="ad-summary-copy">
            <small>선택 실습</small>
            <strong id="ad-demo-title">테스트 광고 연결</strong>
          </span>
          <Icon className="ad-chevron" name="chevron-down" size={18} />
        </summary>
        <section className="ad-content" aria-labelledby="ad-demo-title">
          <p>
            {status === "unsupported"
              ? "브라우저에서는 광고를 호출하지 않아요. QR로 토스 앱에서 공식 테스트 광고를 확인해요."
              : status === "failed"
                ? "광고 준비가 끝나지 않았어요. 핵심 기능은 계속 사용할 수 있어요."
                : "브라우저에서는 안내만 보여요. QR에서는 공식 테스트 ID로 확인할 수 있어요."}
          </p>
          <Button
            display="full"
            loading={status === "loading" || status === "showing"}
            onClick={() => {
              if (status === "ready") show();
              else if (status !== "showing") load();
            }}
            variant="weak"
          >
            {status === "ready"
              ? "테스트 광고 보기"
              : status === "showing"
                ? "테스트 광고 표시 중"
                : "테스트 광고 준비"}
          </Button>
        </section>
      </details>
      <p className="course-signature">작게 만들고, 실제 화면에서 확인해요.</p>
    </footer>
  );
}
