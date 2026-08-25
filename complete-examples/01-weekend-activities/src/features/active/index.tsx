import {
  Badge,
  Button,
  FixedBottomCTA,
  ListRow,
  SegmentedControl,
  Toast,
  Top,
} from "@toss/tds-mobile";
import { useState } from "react";
import { activities, type Activity } from "../../content/activities";
import { jsonStorage } from "../../platform/storage";
import { Icon } from "../../ui/Icon";
import { TossfaceEmoji } from "../../ui/TossfaceEmoji";
import type { TossfaceName } from "../../ui/tossface";
import { useTransientToast } from "../../ui/useTransientToast";
import { filterActivities, freeFirst, toggleSaved } from "./model";

type View = "list" | "detail" | "saved";
const storageKey = "course.weekend.saved.v1";
const isComplete = String("complete") === "complete";
const categories = ["전체", "실내", "야외", "동네"];
const isSavedIds = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const activityEmoji: Record<string, TossfaceName> = {
  bakery: "croissant",
  board: "smile",
  book: "books",
  exhibit: "cityscape",
  picnic: "cityscape",
  walk: "compass",
};

function ActivityRow({
  activity,
  onClick,
  saved,
}: {
  activity: Activity;
  onClick: () => void;
  saved: boolean;
}) {
  return (
    <button
      aria-label={`${activity.name} 상세 보기`}
      className="list-row-button"
      data-demo={`weekend-activity-${activity.id}`}
      onClick={onClick}
      type="button"
    >
      <ListRow
        as="div"
        arrowType="right"
        border="none"
        contents={
          <span className="row-copy">
            <strong>{activity.name}</strong>
            <span>
              {activity.area} · {activity.duration}
            </span>
          </span>
        }
        left={
          <span className="row-emoji" aria-hidden="true">
            <TossfaceEmoji
              name={activityEmoji[activity.id] ?? "compass"}
              size={38}
            />
          </span>
        }
        right={
          <span className="row-status">
            {activity.free && (
              <Badge color="green" size="small" variant="weak">
                무료
              </Badge>
            )}
            {saved && <span className="saved-mark">저장됨</span>}
          </span>
        }
        verticalPadding="large"
        withTouchEffect
      />
    </button>
  );
}

export function ActiveFeature() {
  const [view, setView] = useState<View>("list");
  const [returnView, setReturnView] = useState<"list" | "saved">("list");
  const [category, setCategory] = useState("전체");
  const [selectedId, setSelectedId] = useState(activities[0].id);
  const [savedIds, setSavedIds] = useState(() =>
    jsonStorage.read(storageKey, [], isSavedIds),
  );
  const toast = useTransientToast();
  const visible =
    view === "saved"
      ? activities.filter((item) => savedIds.includes(item.id))
      : filterActivities(activities, category);
  const listed = isComplete ? freeFirst(visible) : visible;
  const selected = activities.find((item) => item.id === selectedId);

  const toggle = (id: string) => {
    const wasSaved = savedIds.includes(id);
    const next = toggleSaved(savedIds, id);
    setSavedIds(next);
    jsonStorage.write(storageKey, next);
    toast.show(wasSaved ? "저장을 취소했어요" : "내 주말에 저장했어요");
  };
  const openDetail = (id: string) => {
    setSelectedId(id);
    setReturnView(view === "saved" ? "saved" : "list");
    setView("detail");
  };

  if (view === "detail" && selected) {
    const saved = savedIds.includes(selected.id);
    return (
      <section className="screen screen-enter weekend-detail">
        <button
          aria-label="활동 목록으로 돌아가기"
          className="icon-button touch-target"
          onClick={() => setView(returnView)}
          type="button"
        >
          <Icon name="arrow-left" />
        </button>
        <div className="detail-hero" aria-hidden="true">
          <TossfaceEmoji
            name={activityEmoji[selected.id] ?? "compass"}
            size={96}
          />
        </div>
        <Top
          subtitleBottom={selected.description}
          subtitleTop={
            <span className="badge-line">
              <Badge color="elephant" size="medium" variant="weak">
                {selected.category}
              </Badge>
              {selected.free && (
                <Badge color="green" size="medium" variant="weak">
                  무료 활동
                </Badge>
              )}
            </span>
          }
          title={selected.name}
        />
        <div className="info-list">
          <ListRow
            border="none"
            contents={
              <span className="row-copy">
                <span>추천 지역</span>
                <strong>{selected.area}</strong>
              </span>
            }
          />
          <ListRow
            border="none"
            contents={
              <span className="row-copy">
                <span>예상 시간</span>
                <strong>{selected.duration}</strong>
              </span>
            }
          />
        </div>
        <FixedBottomCTA
          data-demo="weekend-save"
          onClick={() => toggle(selected.id)}
          variant={saved ? "weak" : "fill"}
        >
          {saved ? "저장 취소하기" : "내 주말에 저장하기"}
        </FixedBottomCTA>
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

  const savedView = view === "saved";
  return (
    <section className="screen screen-enter">
      <Top
        subtitleBottom={
          savedView
            ? "마음에 둔 활동을 한곳에서 다시 확인해요."
            : "가까운 곳에서 이번 주말의 한 가지를 골라보세요."
        }
        title={savedView ? "내 주말 목록" : "이번 주말 뭐하지?"}
      />
      <div className="screen-control">
        <SegmentedControl
          onChange={(next) => setView(next as "list" | "saved")}
          size="large"
          value={savedView ? "saved" : "list"}
        >
          <SegmentedControl.Item value="list">둘러보기</SegmentedControl.Item>
          <SegmentedControl.Item value="saved">
            저장 {savedIds.length}
          </SegmentedControl.Item>
        </SegmentedControl>
      </div>
      {!savedView && (
        <div className="screen-control compact-control">
          <SegmentedControl
            onChange={setCategory}
            size="small"
            value={category}
          >
            {categories.map((item) => (
              <SegmentedControl.Item key={item} value={item}>
                {item}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl>
        </div>
      )}
      <div
        className="list-section"
        data-demo={savedView ? "weekend-saved-list" : "weekend-list"}
      >
        {listed.length > 0 ? (
          listed.map((activity) => (
            <ActivityRow
              activity={activity}
              key={activity.id}
              onClick={() => openDetail(activity.id)}
              saved={savedIds.includes(activity.id)}
            />
          ))
        ) : (
          <div className="empty-state">
            <TossfaceEmoji name="compass" size={72} />
            <h2>아직 저장한 활동이 없어요</h2>
            <p>가볍게 둘러보고 끌리는 활동을 저장해 보세요.</p>
            <Button
              display="full"
              onClick={() => setView("list")}
              variant="weak"
            >
              활동 둘러보기
            </Button>
          </div>
        )}
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
