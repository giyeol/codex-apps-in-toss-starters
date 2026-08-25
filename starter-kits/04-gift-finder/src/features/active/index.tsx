import {
  Badge,
  Button,
  FixedBottomCTA,
  ListRow,
  ProgressBar,
  Toast,
  Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import service from "../../../service.config.json";
import { fallbackGifts, type Gift } from "../../content/fallback-gifts";
import { Icon } from "../../ui/Icon";
import { TossfaceEmoji } from "../../ui/TossfaceEmoji";
import type { TossfaceName } from "../../ui/tossface";
import { useTransientToast } from "../../ui/useTransientToast";
import {
  budgets,
  findGifts,
  localRecommendations,
  nextGiftStep,
  occasions,
  previousGiftStep,
  recipients,
  type GiftInput,
  type GiftStep,
} from "./model";

type RequestState = "idle" | "loading" | "error";
type Source = "mock-api" | "local-fallback";
const isComplete = String("starter") === "complete";
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
const stepMeta: Record<
  Exclude<GiftStep, "review" | "results">,
  {
    emoji: TossfaceName;
    key: keyof GiftInput;
    subtitle: string;
    title: string;
    values: readonly string[];
  }
> = {
  recipient: {
    emoji: "smile",
    key: "recipient",
    subtitle: "선물을 받을 사람을 떠올려 보세요.",
    title: "누구에게 전하나요?",
    values: recipients,
  },
  budget: {
    emoji: "gift",
    key: "budget",
    subtitle: "부담 없는 범위 안에서 골라보세요.",
    title: "예산은 어느 정도인가요?",
    values: budgets,
  },
  occasion: {
    emoji: "cake",
    key: "occasion",
    subtitle: "어떤 마음을 전하고 싶은지 알려주세요.",
    title: "어떤 상황의 선물인가요?",
    values: occasions,
  },
};
const giftEmoji: Record<string, TossfaceName> = {
  candle: "candle",
  dessert: "cake",
  plant: "plant",
  tea: "tea",
  towel: "gift",
  tumbler: "tumbler",
};

function GiftResultRow({ gift }: { gift: Gift }) {
  return (
    <ListRow
      border="none"
      contents={
        <span className="row-copy gift-result-copy">
          <strong>{gift.name}</strong>
          <span>{gift.reason}</span>
          {isComplete && (
            <span className="gift-price">
              예상 가격 {priceRanges[gift.priceRange] ?? gift.priceRange}
            </span>
          )}
        </span>
      }
      left={
        <span className="row-emoji" aria-hidden="true">
          <TossfaceEmoji name={giftEmoji[gift.id] ?? "gift"} size={44} />
        </span>
      }
      verticalPadding="xlarge"
    />
  );
}

export function ActiveFeature() {
  const [input, setInput] = useState<GiftInput>({
    recipient: "friend",
    budget: "under-30000",
    occasion: "birthday",
  });
  const [step, setStep] = useState<GiftStep>("recipient");
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [source, setSource] = useState<Source>("local-fallback");
  const [items, setItems] = useState(fallbackGifts);
  const toast = useTransientToast();

  const select = (key: keyof GiftInput, value: string) => {
    setInput((current) => ({ ...current, [key]: value }) as GiftInput);
  };
  const run = async () => {
    setRequestState("loading");
    try {
      const result = await findGifts(input, {
        apiUrl: service.giftApiUrl,
        fallback: fallbackGifts,
      });
      setItems(result.items);
      setSource(result.source);
      setRequestState("idle");
      setStep("results");
    } catch {
      setRequestState("error");
    }
  };
  const useFallback = () => {
    setItems(localRecommendations(input, fallbackGifts));
    setSource("local-fallback");
    setRequestState("idle");
    setStep("results");
    toast.show("준비된 추천을 보여드려요");
  };

  if (step === "results") {
    return (
      <section
        className="screen screen-enter gift-results"
        data-demo="gift-results"
      >
        <Top
          subtitleTop={
            <Badge color="red" size="medium" variant="weak">
              {source === "mock-api" ? "맞춤 추천" : "바로 추천"}
            </Badge>
          }
          subtitleBottom={`${korean[input.recipient]} · ${korean[input.budget]} · ${korean[input.occasion]}`}
          title="이런 선물은 어때요?"
        />
        <div className="result-hero" aria-hidden="true">
          <TossfaceEmoji name="gift" size={96} />
        </div>
        <div className="gift-results-content">
          <div className="gift-result-list" aria-live="polite">
            {items.map((gift) => (
              <GiftResultRow gift={gift} key={gift.id} />
            ))}
          </div>
          <Button
            display="full"
            onClick={() => setStep("recipient")}
            variant="weak"
          >
            조건 바꿔서 다시 추천받기
          </Button>
        </div>
        <Toast
          onClose={toast.clear}
          open={Boolean(toast.message)}
          position="bottom"
          text={toast.message ?? ""}
        />
      </section>
    );
  }

  if (step === "review") {
    return (
      <section className="screen screen-enter gift-review">
        <button
          aria-label="이전 단계로 돌아가기"
          className="icon-button touch-target"
          onClick={() => setStep(previousGiftStep(step))}
          type="button"
        >
          <Icon name="arrow-left" />
        </button>
        <div className="progress-section">
          <ProgressBar
            aria-label="선물 조건 선택 완료"
            color="var(--course-primary)"
            progress={1}
            size="bold"
          />
        </div>
        <Top
          subtitleBottom="조건이 맞다면 바로 세 가지 선물을 찾아드릴게요."
          title="이렇게 추천할까요?"
        />
        <div className="review-list">
          {(
            [
              ["recipient", "받는 사람"],
              ["budget", "예산"],
              ["occasion", "상황"],
            ] as const
          ).map(([key, label]) => (
            <button
              className="list-row-button"
              key={key}
              onClick={() => setStep(key)}
              type="button"
            >
              <ListRow
                as="div"
                arrowType="right"
                border="none"
                contents={
                  <span className="row-copy">
                    <span>{label}</span>
                    <strong>{korean[input[key]]}</strong>
                  </span>
                }
                withTouchEffect
              />
            </button>
          ))}
        </div>

        {requestState === "loading" && (
          <div aria-live="polite" className="loading-panel">
            <TossfaceEmoji name="gift" size={48} />
            <span>
              <strong>어울리는 선물을 찾고 있어요</strong>
              <p>조건에 맞는 후보 세 가지를 비교하는 중이에요.</p>
            </span>
          </div>
        )}
        {requestState === "error" && (
          <div className="error-panel" role="alert">
            <strong>추천을 불러오지 못했어요</strong>
            <p>연결을 확인해 다시 시도하거나 준비된 추천을 볼 수 있어요.</p>
            <div className="error-actions">
              <Button display="full" onClick={run} variant="weak">
                다시 시도하기
              </Button>
              <Button display="full" onClick={useFallback}>
                예비 추천 보기
              </Button>
            </div>
          </div>
        )}
        <FixedBottomCTA
          data-demo="gift-next"
          disabled={requestState === "loading"}
          loading={requestState === "loading"}
          onClick={run}
        >
          선물 추천받기
        </FixedBottomCTA>
      </section>
    );
  }

  const meta = stepMeta[step];
  const stepNumber = step === "recipient" ? 1 : step === "budget" ? 2 : 3;
  return (
    <section className="screen screen-enter gift-step-screen">
      {step !== "recipient" && (
        <button
          aria-label="이전 단계로 돌아가기"
          className="icon-button touch-target"
          onClick={() => setStep(previousGiftStep(step))}
          type="button"
        >
          <Icon name="arrow-left" />
        </button>
      )}
      <div className="progress-section">
        <span className="progress-label">{stepNumber} / 4</span>
        <ProgressBar
          aria-label={`선물 조건 ${stepNumber}단계`}
          color="var(--course-primary)"
          progress={stepNumber / 4}
          size="bold"
        />
      </div>
      <Top subtitleBottom={meta.subtitle} title={meta.title} />
      <div className="step-visual" aria-hidden="true">
        <TossfaceEmoji name={meta.emoji} size={72} />
      </div>
      <div className="choice-list">
        {meta.values.map((value) => {
          const selected = input[meta.key] === value;
          return (
            <button
              aria-pressed={selected}
              className="list-row-button choice-row"
              data-demo={`gift-${meta.key}-${value}`}
              key={value}
              onClick={() => select(meta.key, value)}
              type="button"
            >
              <ListRow
                as="div"
                border="none"
                contents={
                  <span className="row-copy">
                    <strong>{korean[value]}</strong>
                  </span>
                }
                right={
                  selected ? <span className="selected-check">✓</span> : null
                }
                verticalPadding="xlarge"
                withTouchEffect
              />
            </button>
          );
        })}
      </div>
      <FixedBottomCTA
        data-demo="gift-next"
        onClick={() => setStep(nextGiftStep(step))}
      >
        다음
      </FixedBottomCTA>
    </section>
  );
}
