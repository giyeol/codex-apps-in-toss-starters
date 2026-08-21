import { Button } from "@toss/tds-mobile";
import { useState } from "react";
import service from "../../../service.config.json";
import { fallbackGifts } from "../../content/fallback-gifts";
import { Icon } from "../../ui/Icon";
import {
  budgets,
  findGifts,
  localRecommendations,
  occasions,
  recipients,
  type GiftInput,
} from "./model";

type State = "idle" | "loading" | "success" | "error";
type Source = "mock-api" | "local-fallback";
const korean: Record<string, string> = {
  friend: "친구",
  family: "가족",
  colleague: "동료",
  "under-30000": "3만원 이하",
  "30000-50000": "3만~5만원",
  "over-50000": "5만원 이상",
  birthday: "생일",
  thanks: "감사",
  housewarming: "집들이",
};
const priceRanges: Record<string, string> = {
  "20000-30000": "2만~3만원",
  "30000-50000": "3만~5만원",
  "50000+": "5만원 이상",
};
const steps: Array<{
  key: keyof GiftInput;
  title: string;
  values: readonly string[];
}> = [
  { key: "recipient", title: "누구에게 전하나요?", values: recipients },
  { key: "budget", title: "예산은 어느 정도인가요?", values: budgets },
  { key: "occasion", title: "어떤 마음을 전하나요?", values: occasions },
];
const isComplete = String("{{COURSE_FLAVOR}}") === "complete";

export function ActiveFeature() {
  const [input, setInput] = useState<GiftInput>({
    recipient: "friend",
    budget: "under-30000",
    occasion: "birthday",
  });
  const [state, setState] = useState<State>("idle");
  const [source, setSource] = useState<Source>("local-fallback");
  const [items, setItems] = useState(fallbackGifts);
  const select = (key: keyof GiftInput, value: string) => {
    setInput((current) => ({ ...current, [key]: value }) as GiftInput);
    if (state === "success") setState("idle");
  };
  const run = async () => {
    setState("loading");
    try {
      const result = await findGifts(input, {
        apiUrl: service.giftApiUrl,
        fallback: fallbackGifts,
      });
      setItems(result.items);
      setSource(result.source);
      setState("success");
    } catch {
      setState("error");
    }
  };
  const fallback = () => {
    setItems(localRecommendations(input, fallbackGifts));
    setSource("local-fallback");
    setState("success");
  };

  return (
    <section className="stack">
      {state === "success" ? (
        <article className="surface gift-complete-summary">
          <span className="gift-complete-icon">
            <Icon name="check" size={20} />
          </span>
          <div>
            <small>선택한 조건</small>
            <strong>
              {korean[input.recipient]} · {korean[input.budget]} ·{" "}
              {korean[input.occasion]}
            </strong>
          </div>
          <button
            className="text-action"
            onClick={() => setState("idle")}
            type="button"
          >
            바꾸기
          </button>
        </article>
      ) : (
        <article className="surface gift-form">
          <div className="gift-form-head">
            <h2>딱 맞는 선물을 찾아볼게요</h2>
            <p>세 가지 조건만 고르면 어울리는 후보를 바로 보여드려요.</p>
          </div>
          {steps.map((step, index) => (
            <fieldset
              className="gift-step"
              disabled={state === "loading"}
              key={step.key}
            >
              <legend>
                <span className="gift-step-number">{index + 1}</span>
                {step.title}
              </legend>
              <div className="gift-options">
                {step.values.map((value) => (
                  <button
                    aria-pressed={input[step.key] === value}
                    className="gift-option"
                    key={value}
                    onClick={() => select(step.key, value)}
                    type="button"
                  >
                    {korean[value]}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="gift-selection-summary">
            <Icon name="gift" size={19} />
            <span>
              {korean[input.recipient]}에게 · {korean[input.budget]} ·{" "}
              {korean[input.occasion]}
            </span>
          </div>
          <Button display="full" loading={state === "loading"} onClick={run}>
            {state === "loading" ? "선물을 찾고 있어요" : "선물 추천받기"}
          </Button>
        </article>
      )}

      {state === "loading" && (
        <article aria-live="polite" className="surface gift-loading">
          <span className="gift-loading-icon">
            <Icon name="sparkle" size={24} />
          </span>
          <div>
            <strong>마음을 담을 선물을 고르는 중이에요</strong>
            <p>조건에 잘 맞는 후보 세 가지를 비교하고 있어요.</p>
          </div>
        </article>
      )}

      {state === "error" && (
        <article className="surface gift-error" role="alert">
          <span className="gift-error-icon">
            <Icon name="refresh" size={24} />
          </span>
          <div>
            <h2>추천을 불러오지 못했어요</h2>
            <p>
              연결을 확인한 뒤 다시 시도하거나, 준비된 예비 추천을 볼 수 있어요.
            </p>
          </div>
          <div className="gift-error-actions">
            <Button display="full" onClick={run} variant="weak">
              다시 시도하기
            </Button>
            <Button display="full" onClick={fallback}>
              예비 추천 보기
            </Button>
          </div>
        </article>
      )}

      {state === "success" && (
        <section className="gift-results" aria-live="polite">
          <div className="gift-results-head">
            <div>
              <p>추천 완료</p>
              <h2>이런 선물은 어때요?</h2>
            </div>
            <span className="status-chip">
              {source === "mock-api" ? "API 추천" : "예비 추천"}
            </span>
          </div>
          {items.map((item, index) => (
            <article className="gift-result-card" key={item.id}>
              <div className="gift-result-visual" aria-hidden="true">
                <span className="gift-rank">{index + 1}</span>
                <Icon name="gift" size={29} />
              </div>
              <div className="gift-result-copy">
                <h3>{item.name}</h3>
                <p className="gift-reason">{item.reason}</p>
                {isComplete && (
                  <p className="gift-price">
                    예상 가격 {priceRanges[item.priceRange] ?? item.priceRange}
                  </p>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </section>
  );
}
