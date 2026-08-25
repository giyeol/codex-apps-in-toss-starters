import {
  Badge,
  Button,
  FixedBottomCTA,
  ListRow,
  ProgressBar,
  SegmentedControl,
  TextArea,
  TextField,
  Toast,
  Top,
} from "@toss/tds-mobile";
import { useState, type FormEvent } from "react";
import { habitDefaults } from "../../content/habit";
import { jsonStorage } from "../../platform/storage";
import { TossfaceEmoji } from "../../ui/TossfaceEmoji";
import type { TossfaceName } from "../../ui/tossface";
import { useTransientToast } from "../../ui/useTransientToast";
import {
  exampleCheckIns,
  localDate,
  streak,
  upsertCheckIn,
  validHabitName,
  validHabitState,
  type HabitMood,
  type HabitState,
} from "./model";

type View = "today" | "history" | "setup";
const storageKey = "course.habit.v1";
const isComplete = String("{{COURSE_FLAVOR}}") === "complete";
const weekday = ["일", "월", "화", "수", "목", "금", "토"];
const moods: Array<{ label: string; name: TossfaceName; value: HabitMood }> = [
  { label: "가뿐해요", name: "seedling", value: "fresh" },
  { label: "차분해요", name: "smile", value: "calm" },
  { label: "뿌듯해요", name: "fire", value: "proud" },
];

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
  const [mood, setMood] = useState<HabitMood>("fresh");
  const [habitDraft, setHabitDraft] = useState(state.habit);
  const [habitError, setHabitError] = useState("");
  const toast = useTransientToast();
  const today = localDate();
  const currentStreak = streak(state.records, today);
  const todayRecord = state.records.find((record) => record.date === today);
  const week = recentDates(today);
  const recordByDate = new Map(
    state.records.map((record) => [record.date, record]),
  );

  const persist = (next: HabitState) => {
    setState(next);
    jsonStorage.write(storageKey, next);
  };
  const save = (done: boolean) => {
    const next = {
      ...state,
      records: upsertCheckIn(state.records, {
        date: today,
        done,
        memo: memo.slice(0, 80),
        mood,
      }),
    };
    persist(next);
    setView("history");
    toast.show(done ? "오늘의 기록을 저장했어요" : "쉬어간 날로 기록했어요");
  };
  const saveHabit = (event?: FormEvent) => {
    event?.preventDefault();
    const habit = habitDraft.trim();
    if (!validHabitName(habit)) {
      setHabitError("습관명은 1~80자로 입력해 주세요.");
      return;
    }
    persist({ ...state, habit });
    setHabitDraft(habit);
    setHabitError("");
    setView("today");
    toast.show("습관을 바꿨어요");
  };
  const fillExample = () => {
    const records = exampleCheckIns(today).reduce(upsertCheckIn, state.records);
    persist({ ...state, records });
    setView("history");
  };

  if (view === "setup") {
    return (
      <section className="screen screen-enter">
        <Top
          subtitleBottom="매일 가볍게 확인할 수 있는 작은 행동이 좋아요."
          title="어떤 습관을 이어갈까요?"
        />
        <form className="form-section" onSubmit={saveHabit}>
          <div className="center-visual" aria-hidden="true">
            <TossfaceEmoji name="seedling" size={86} />
          </div>
          <TextField
            aria-describedby={habitError ? "habit-error" : undefined}
            aria-invalid={Boolean(habitError)}
            hasError={Boolean(habitError)}
            help={habitError || habitDefaults.message}
            label="나의 습관"
            labelOption="sustain"
            maxLength={80}
            onChange={(event) => {
              setHabitDraft(event.target.value);
              setHabitError("");
            }}
            placeholder="예: 하루 10분 걷기"
            value={habitDraft}
            variant="box"
          />
          {habitError && (
            <span className="sr-only" id="habit-error" role="alert">
              {habitError}
            </span>
          )}
          <Button
            display="full"
            onClick={() => setView("today")}
            variant="weak"
          >
            취소
          </Button>
          <FixedBottomCTA type="submit">습관 저장하기</FixedBottomCTA>
        </form>
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

  const historyView = view === "history";
  return (
    <section className="screen screen-enter">
      <Top
        right={
          <Button onClick={() => setView("setup")} size="small" variant="weak">
            습관 바꾸기
          </Button>
        }
        subtitleBottom={state.habit}
        title={historyView ? "나의 기록" : "오늘의 작은 습관"}
      />
      <div className="screen-control">
        <SegmentedControl
          onChange={(next) => setView(next as "today" | "history")}
          size="large"
          value={historyView ? "history" : "today"}
        >
          <SegmentedControl.Item value="today">오늘</SegmentedControl.Item>
          <SegmentedControl.Item value="history">
            최근 기록
          </SegmentedControl.Item>
        </SegmentedControl>
      </div>

      {historyView ? (
        <div className="habit-history">
          <section className="streak-panel" data-demo="habit-streak">
            <div className="streak-copy">
              <div>
                <Badge color="green" size="medium" variant="weak">
                  최근 7일
                </Badge>
                <h2>{currentStreak}일 연속 이어가는 중</h2>
              </div>
              <TossfaceEmoji name="fire" size={62} />
            </div>
            <ProgressBar
              aria-label={`7일 중 ${Math.min(currentStreak, 7)}일 연속 달성`}
              color="var(--course-primary)"
              progress={Math.min(currentStreak / 7, 1)}
              size="bold"
            />
            <div className="week-strip" aria-label="최근 7일 달성 현황">
              {week.map((date) => {
                const done = recordByDate.get(date)?.done === true;
                const value = new Date(`${date}T12:00:00`);
                return (
                  <span
                    className={done ? "week-day done" : "week-day"}
                    key={date}
                  >
                    <span>{weekday[value.getDay()]}</span>
                    <b>{done ? "✓" : value.getDate()}</b>
                  </span>
                );
              })}
            </div>
          </section>

          {isComplete && currentStreak >= 3 && (
            <div className="celebration screen-enter" role="status">
              <TossfaceEmoji name="fire" size={42} />
              <span>
                <strong>벌써 3일을 이어왔어요</strong>
                <span>지금의 속도로 가볍게 계속해 보세요.</span>
              </span>
            </div>
          )}

          {state.records.length === 0 ? (
            <div className="empty-state">
              <TossfaceEmoji name="seedling" size={72} />
              <h2>첫 기록을 기다리고 있어요</h2>
              <p>오늘 탭에서 작은 실천을 남겨보세요.</p>
              <Button
                display="full"
                onClick={() => setView("today")}
                variant="weak"
              >
                오늘 기록하기
              </Button>
            </div>
          ) : (
            <div aria-live="polite" className="record-list">
              {[...state.records].reverse().map((record) => (
                <ListRow
                  border="none"
                  contents={
                    <span className="row-copy">
                      <strong>
                        {dateLabel(record.date)} ·{" "}
                        {record.done ? "완료" : "쉬어감"}
                      </strong>
                      <span>{record.memo || "메모 없이 기록했어요"}</span>
                    </span>
                  }
                  key={record.date}
                  left={
                    <TossfaceEmoji
                      name={
                        moods.find((item) => item.value === record.mood)
                          ?.name ?? "seedling"
                      }
                      size={36}
                    />
                  }
                  verticalPadding="large"
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="habit-today">
          <div className="today-hero">
            <TossfaceEmoji
              name={todayRecord?.done ? "fire" : "seedling"}
              size={88}
            />
            <div>
              <Badge color="green" size="medium" variant="weak">
                {dateLabel(today)}
              </Badge>
              <h2>{todayRecord?.done ? "오늘도 해냈어요" : state.habit}</h2>
              <p>
                {todayRecord?.done
                  ? "기록은 언제든 다시 덮어쓸 수 있어요."
                  : "완벽하지 않아도 괜찮아요. 오늘의 한 번을 남겨보세요."}
              </p>
            </div>
          </div>
          <fieldset className="mood-fieldset">
            <legend>오늘 기분은 어때요?</legend>
            <div className="mood-options">
              {moods.map((item) => (
                <button
                  aria-pressed={mood === item.value}
                  className="mood-option touch-target"
                  key={item.value}
                  onClick={() => setMood(item.value)}
                  type="button"
                >
                  <TossfaceEmoji name={item.name} size={36} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <TextArea
            height={112}
            label="오늘의 한 줄"
            labelOption="sustain"
            maxLength={80}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="느낀 점이나 기억하고 싶은 순간을 적어보세요"
            value={memo}
            variant="box"
          />
          <Button display="full" onClick={() => save(false)} variant="weak">
            오늘은 쉬어가기
          </Button>
          {isComplete && (
            <button
              className="demo-text-button touch-target"
              data-demo="habit-fill-example"
              onClick={fillExample}
              type="button"
            >
              완성 화면용 3일 예시 채우기
            </button>
          )}
          <FixedBottomCTA onClick={() => save(true)}>
            오늘 완료하기
          </FixedBottomCTA>
        </div>
      )}
      <Toast
        higherThanCTA={!historyView}
        onClose={toast.clear}
        open={Boolean(toast.message)}
        position="bottom"
        text={toast.message ?? ""}
      />
    </section>
  );
}
