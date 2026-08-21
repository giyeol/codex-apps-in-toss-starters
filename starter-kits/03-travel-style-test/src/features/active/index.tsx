import { Button } from "@toss/tds-mobile";
import { useState } from "react";
import { questions, results } from "../../content/quiz";
import { Icon } from "../../ui/Icon";
import { resolveResult } from "./model";

const isComplete = String("starter") === "complete";
const choiceLabels = ["A", "B", "C"];

export function ActiveFeature() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "done" | "failed">(
    "idle",
  );
  const reset = () => {
    setAnswers([]);
    setStarted(false);
    setCopyState("idle");
  };

  if (!started) {
    return (
      <section className="surface quiz-intro">
        <div className="quiz-art" aria-hidden="true">
          <span className="quiz-art-icon">
            <Icon name="compass" size={30} />
          </span>
        </div>
        <h2>나는 어떤 여행자일까요?</h2>
        <p>익숙한 선택 여섯 가지로 나에게 잘 맞는 여행 방식을 찾아봐요.</p>
        <div className="quiz-facts" aria-label="테스트 안내">
          <span className="status-chip">6개 질문</span>
          <span className="status-chip">약 1분</span>
          <span className="status-chip">3가지 결과</span>
        </div>
        <Button display="full" onClick={() => setStarted(true)}>
          여행 스타일 알아보기
        </Button>
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
        setCopyState("done");
      } catch {
        setCopyState("failed");
      }
    };
    return (
      <section className="surface quiz-result">
        <div className="result-visual" aria-hidden="true">
          <span className="result-emblem">
            <Icon name="compass" size={39} />
          </span>
        </div>
        <div className="result-copy">
          <span className="eyebrow">MY TRAVEL TYPE</span>
          <h2>{result.name}</h2>
          <p className="result-description">{result.description}</p>
          <div className="result-keywords">
            {result.keywords?.map((keyword) => (
              <span className="status-chip" key={keyword}>
                #{keyword}
              </span>
            ))}
          </div>
          {result.note && (
            <div className="result-tip">
              <Icon name="sparkle" size={19} />
              <p>
                <strong>여행 팁</strong>
                {result.note}
              </p>
            </div>
          )}
          <div className="result-actions">
            {isComplete && (
              <Button display="full" onClick={copy} variant="weak">
                <Icon name="copy" size={18} /> 결과 문구 복사하기
              </Button>
            )}
            <Button display="full" onClick={reset}>
              다시 해보기
            </Button>
          </div>
          {isComplete && (
            <p aria-live="polite" className="copy-feedback">
              {copyState === "done"
                ? "결과 문구를 복사했어요."
                : copyState === "failed"
                  ? "이 환경에서는 복사할 수 없어요. 문구를 직접 선택해 주세요."
                  : "친구에게 내 여행 스타일을 알려보세요."}
            </p>
          )}
        </div>
      </section>
    );
  }

  const question = questions[answers.length];
  const progress = ((answers.length + 1) / questions.length) * 100;
  return (
    <section className="surface quiz-question">
      <div className="quiz-progress-head">
        <button
          aria-label={
            answers.length === 0
              ? "처음으로 돌아가기"
              : "이전 질문으로 돌아가기"
          }
          className="icon-button quiz-back"
          onClick={() => {
            if (answers.length === 0) setStarted(false);
            else setAnswers(answers.slice(0, -1));
          }}
          type="button"
        >
          <Icon name="arrow-left" size={19} />
        </button>
        <span>
          질문 {answers.length + 1} / {questions.length}
        </span>
      </div>
      <div
        aria-label={`테스트 진행률 ${Math.round(progress)}%`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(progress)}
        className="progress-track"
        role="progressbar"
      >
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <h2>{question.prompt}</h2>
      <div className="quiz-choices">
        {question.choices.map((choice, index) => (
          <button
            className="quiz-choice"
            key={choice.label}
            onClick={() => setAnswers([...answers, choice.score])}
            type="button"
          >
            <span className="quiz-choice-index">{choiceLabels[index]}</span>
            <span>
              <strong>{choice.label}</strong>
              <span>{choice.hint}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
