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
import { questions, results } from "../../content/quiz";
import { Icon } from "../../ui/Icon";
import { TossfaceEmoji } from "../../ui/TossfaceEmoji";
import type { TossfaceName } from "../../ui/tossface";
import { useTransientToast } from "../../ui/useTransientToast";
import { resolveResult } from "./model";

const isComplete = String("{{COURSE_FLAVOR}}") === "complete";
const resultEmoji: Record<string, TossfaceName> = {
  balance: "map",
  explorer: "compass",
  planner: "cityscape",
};

export function ActiveFeature() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const toast = useTransientToast();

  const reset = () => {
    setAnswers([]);
    setStarted(false);
    toast.clear();
  };

  if (!started) {
    return (
      <section className="screen screen-enter quiz-intro">
        <Top
          subtitleBottom="여섯 번의 빠른 선택으로 잘 맞는 여행 방식을 찾아드려요."
          title="나는 어떤 여행자일까요?"
        />
        <div className="center-visual travel-visual" aria-hidden="true">
          <TossfaceEmoji name="compass" size={112} />
        </div>
        <div className="fact-badges" aria-label="테스트 안내">
          <Badge color="elephant" size="medium" variant="weak">
            6개 질문
          </Badge>
          <Badge color="elephant" size="medium" variant="weak">
            약 1분
          </Badge>
          <Badge color="blue" size="medium" variant="weak">
            3가지 결과
          </Badge>
        </div>
        <div className="intro-note">
          <strong>정답은 없어요</strong>
          <p>지금 마음에 더 가까운 답을 가볍게 골라보세요.</p>
        </div>
        <FixedBottomCTA
          data-demo="travel-start"
          onClick={() => setStarted(true)}
        >
          여행 스타일 알아보기
        </FixedBottomCTA>
      </section>
    );
  }

  if (answers.length === questions.length) {
    const result = resolveResult(answers, results);
    const copy = async () => {
      try {
        if (!navigator.clipboard?.writeText) {
          throw new Error("Clipboard API is unsupported");
        }
        await navigator.clipboard.writeText(
          `${result.name}: ${result.description}`,
        );
        toast.show("결과 문구를 복사했어요");
      } catch {
        toast.show("이 환경에서는 복사할 수 없어요");
      }
    };

    return (
      <section
        className="screen screen-enter quiz-result"
        data-demo="travel-result"
      >
        <Top subtitleTop="나의 여행 스타일" title={result.name} />
        <div className="result-hero" aria-hidden="true">
          <TossfaceEmoji
            name={resultEmoji[result.id] ?? "compass"}
            size={104}
          />
        </div>
        <div className="result-content">
          <p className="result-description">{result.description}</p>
          <div className="keyword-list">
            {result.keywords?.map((keyword) => (
              <Badge color="blue" key={keyword} size="medium" variant="weak">
                #{keyword}
              </Badge>
            ))}
          </div>
          {result.note && (
            <div className="tip-panel">
              <TossfaceEmoji name="map" size={42} />
              <span>
                <strong>이렇게 여행해 보세요</strong>
                <p>{result.note}</p>
              </span>
            </div>
          )}
          {isComplete && (
            <Button display="full" onClick={copy} variant="weak">
              결과 문구 복사하기
            </Button>
          )}
        </div>
        <FixedBottomCTA onClick={reset}>다시 해보기</FixedBottomCTA>
        <Toast
          higherThanCTA
          onClose={toast.clear}
          open={Boolean(toast.message)}
          position="bottom"
          text={toast.message ?? ""}
        />
      </section>
    );
  }

  const question = questions[answers.length];
  const progress = (answers.length + 1) / questions.length;
  return (
    <section className="screen screen-enter quiz-question">
      <div className="question-navigation">
        <button
          aria-label={
            answers.length === 0
              ? "처음으로 돌아가기"
              : "이전 질문으로 돌아가기"
          }
          className="icon-button touch-target"
          onClick={() => {
            if (answers.length === 0) setStarted(false);
            else setAnswers(answers.slice(0, -1));
          }}
          type="button"
        >
          <Icon name="arrow-left" />
        </button>
        <span>
          {answers.length + 1} / {questions.length}
        </span>
      </div>
      <div className="progress-section">
        <ProgressBar
          aria-label={`테스트 진행률 ${Math.round(progress * 100)}%`}
          color="var(--course-primary)"
          progress={progress}
          size="bold"
        />
      </div>
      <Top
        subtitleTop="지금 마음에 가까운 답을 골라주세요"
        title={question.prompt}
      />
      <div className="choice-list">
        {question.choices.map((choice, index) => (
          <button
            aria-label={`${choice.label}, ${choice.hint}`}
            className="list-row-button choice-row"
            data-demo={`travel-choice-${index}`}
            key={choice.label}
            onClick={() => setAnswers([...answers, choice.score])}
            type="button"
          >
            <ListRow
              as="div"
              arrowType="right"
              border="none"
              contents={
                <span className="row-copy">
                  <strong>{choice.label}</strong>
                  <span>{choice.hint}</span>
                </span>
              }
              left={<span className="choice-index">{index + 1}</span>}
              verticalPadding="xlarge"
              withTouchEffect
            />
          </button>
        ))}
      </div>
    </section>
  );
}
