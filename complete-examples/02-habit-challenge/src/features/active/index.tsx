import { Button } from "@toss/tds-mobile";
import { useState, type FormEvent } from "react";
import { habitDefaults } from "../../content/habit";
import { jsonStorage } from "../../platform/storage";
import { Icon } from "../../ui/Icon";
import {
  localDate,
  exampleCheckIns,
  streak,
  upsertCheckIn,
  validHabitName,
  validHabitState,
  type HabitState,
} from "./model";

type View = "setup" | "today" | "progress";
const storageKey = "course.habit.v1";
const isComplete = String("complete") === "complete";
const weekday = ["일", "월", "화", "수", "목", "금", "토"];

function recentDates(anchor: string) {
  const dates: string[] = [];
  const cursor = new Date(`${anchor}T12:00:00`);
  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date(cursor);
    date.setDate(cursor.getDate() - index);
    dates.push(localDate(date));
  }
  return dates;
}

function dateLabel(date: string) {
  const value = new Date(`${date}T12:00:00`);
  return `${value.getMonth() + 1}월 ${value.getDate()}일`;
}

export function ActiveFeature() {
  const [state, setState] = useState(() =>
    jsonStorage.read<HabitState>(
      storageKey,
      { habit: habitDefaults.name, records: [] },
      validHabitState,
    ),
  );
  const [view, setView] = useState<View>("today");
  const [memo, setMemo] = useState("");
  const [habitDraft, setHabitDraft] = useState(state.habit);
  const [habitError, setHabitError] = useState("");
  const today = localDate();
  const currentStreak = streak(state.records, today);
  const todayRecord = state.records.find((record) => record.date === today);
  const week = recentDates(today);
  const recordByDate = new Map(
    state.records.map((record) => [record.date, record]),
  );

  const save = (done: boolean) => {
    const next = {
      ...state,
      records: upsertCheckIn(state.records, {
        date: today,
        done,
        memo: memo.slice(0, 80),
      }),
    };
    setState(next);
    jsonStorage.write(storageKey, next);
    setView("progress");
  };
  const saveHabit = (event?: FormEvent) => {
    event?.preventDefault();
    const habit = habitDraft.trim();
    if (!validHabitName(habit)) {
      setHabitError("습관명은 1~80자로 입력해 주세요.");
      return;
    }
    const next = { ...state, habit };
    setState(next);
    jsonStorage.write(storageKey, next);
    setHabitDraft(habit);
    setHabitError("");
    setView("today");
  };
  const fillExample = () => {
    const records = exampleCheckIns(today).reduce(upsertCheckIn, state.records);
    const next = { ...state, records };
    setState(next);
    jsonStorage.write(storageKey, next);
    setView("progress");
  };

  return (
    <section className="stack">
      <div className="habit-overview">
        <div>
          <p>나의 7일 목표</p>
          <strong>{state.habit}</strong>
        </div>
        <div
          className="habit-streak"
          aria-label={`연속 달성 ${currentStreak}일`}
        >
          <b>{currentStreak}</b>
          <span>일째</span>
        </div>
      </div>

      <nav className="segmented habit-nav" aria-label="습관 메뉴">
        <button
          aria-pressed={view === "today"}
          className={view === "today" ? "segment active" : "segment"}
          onClick={() => setView("today")}
          type="button"
        >
          오늘
        </button>
        <button
          aria-pressed={view === "progress"}
          className={view === "progress" ? "segment active" : "segment"}
          onClick={() => setView("progress")}
          type="button"
        >
          진행 현황
        </button>
        <button
          aria-pressed={view === "setup"}
          className={view === "setup" ? "segment active" : "segment"}
          onClick={() => setView("setup")}
          type="button"
        >
          설정
        </button>
      </nav>

      {view === "setup" && (
        <article className="surface habit-panel">
          <span className="habit-hero-icon">
            <Icon name="sparkle" size={27} />
          </span>
          <h2>이어가고 싶은 한 가지</h2>
          <p className="habit-panel-copy">
            부담 없이 매일 확인할 수 있는 작은 행동을 적어보세요.
          </p>
          <form className="habit-form" onSubmit={saveHabit}>
            <label className="field-label">
              나의 습관
              <input
                aria-describedby={habitError ? "habit-error" : undefined}
                aria-invalid={Boolean(habitError)}
                maxLength={80}
                onChange={(event) => {
                  setHabitDraft(event.target.value);
                  setHabitError("");
                }}
                placeholder="예: 하루 10분 걷기"
                value={habitDraft}
              />
            </label>
            {habitError && (
              <p className="error-copy" id="habit-error" role="alert">
                {habitError}
              </p>
            )}
            <p className="habit-panel-copy">{habitDefaults.message}</p>
            <Button display="full" type="submit">
              습관 저장하기
            </Button>
          </form>
        </article>
      )}

      {view === "today" && (
        <article className="surface habit-panel">
          <span className="habit-hero-icon">
            <Icon name="walk" size={29} />
          </span>
          <span className="status-chip">
            <Icon name="calendar" size={14} /> {dateLabel(today)}
          </span>
          <h2>{todayRecord?.done ? "오늘도 해냈어요" : state.habit}</h2>
          <p className="habit-panel-copy">
            {todayRecord?.done
              ? "작은 실천이 쌓였어요. 진행 현황에서 기록을 확인해 보세요."
              : "완벽하지 않아도 괜찮아요. 오늘의 한 번을 남겨보세요."}
          </p>
          <div className="habit-form">
            <label className="field-label">
              오늘의 한 줄
              <textarea
                maxLength={80}
                onChange={(event) => setMemo(event.target.value)}
                placeholder="느낀 점이나 기억하고 싶은 순간을 적어보세요"
                value={memo}
              />
            </label>
            <div className="habit-actions">
              <Button display="full" onClick={() => save(true)}>
                <Icon name="check" size={18} /> 오늘 완료하기
              </Button>
              <Button display="full" onClick={() => save(false)} variant="weak">
                오늘은 쉬어가기
              </Button>
              {isComplete && (
                <button
                  className="habit-example-button"
                  onClick={fillExample}
                  type="button"
                >
                  완성 화면용 3일 예시 채우기
                </button>
              )}
            </div>
          </div>
        </article>
      )}

      {view === "progress" && (
        <article className="surface habit-panel">
          <div className="section-head">
            <div>
              <p>최근 7일</p>
              <h2>{currentStreak}일 연속 이어가는 중</h2>
            </div>
            <Icon name="chart" size={25} />
          </div>
          <div className="week-strip" aria-label="최근 7일 달성 현황">
            {week.map((date) => {
              const record = recordByDate.get(date);
              const done = record?.done === true;
              const value = new Date(`${date}T12:00:00`);
              return (
                <div className={done ? "week-day done" : "week-day"} key={date}>
                  <span>{weekday[value.getDay()]}</span>
                  <span className="week-day-dot">
                    {done ? <Icon name="check" size={16} /> : value.getDate()}
                  </span>
                </div>
              );
            })}
          </div>
          {isComplete && currentStreak >= 3 && (
            <div className="celebration" role="status">
              <span className="celebration-icon">
                <Icon name="sparkle" size={20} />
              </span>
              <div>
                <strong>벌써 3일을 이어왔어요</strong>
                <span>지금의 속도로 가볍게 계속해 보세요.</span>
              </div>
            </div>
          )}
          {state.records.length === 0 ? (
            <div className="empty-state habit-empty">
              <div>
                <span className="empty-state-icon">
                  <Icon name="calendar" size={27} />
                </span>
                <h2>첫 기록을 기다리고 있어요</h2>
                <p>오늘 탭에서 작은 실천을 남겨보세요.</p>
              </div>
            </div>
          ) : (
            <ul className="record-list">
              {[...state.records].reverse().map((record) => (
                <li className="record-row" key={record.date}>
                  <span
                    className={
                      record.done ? "record-check" : "record-check missed"
                    }
                  >
                    {record.done ? <Icon name="check" size={16} /> : "–"}
                  </span>
                  <span className="record-copy">
                    <strong>
                      {dateLabel(record.date)} ·{" "}
                      {record.done ? "완료" : "쉬어간 날"}
                    </strong>
                    <span>{record.memo || "메모 없이 기록했어요"}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </article>
      )}
    </section>
  );
}
