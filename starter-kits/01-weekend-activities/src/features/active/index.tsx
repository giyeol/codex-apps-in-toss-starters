import { Button } from "@toss/tds-mobile";
import { useState } from "react";
import { activities, type Activity } from "../../content/activities";
import { jsonStorage } from "../../platform/storage";
import { Icon, type IconName } from "../../ui/Icon";
import { filterActivities, freeFirst, toggleSaved } from "./model";

type View = "list" | "detail" | "saved";
const storageKey = "course.weekend.saved.v1";
const isComplete = String("starter") === "complete";
const categories = ["전체", "실내", "야외", "동네"];
const isSavedIds = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

function activityIcon(activity: Activity): IconName {
  if (activity.id === "walk" || activity.id === "picnic") return "walk";
  if (activity.category === "동네") return "pin";
  return "compass";
}

export function ActiveFeature() {
  const [view, setView] = useState<View>("list");
  const [returnView, setReturnView] = useState<"list" | "saved">("list");
  const [category, setCategory] = useState("전체");
  const [selectedId, setSelectedId] = useState(activities[0].id);
  const [savedIds, setSavedIds] = useState(() =>
    jsonStorage.read(storageKey, [], isSavedIds),
  );
  const visible =
    view === "saved"
      ? activities.filter((item) => savedIds.includes(item.id))
      : filterActivities(activities, category);
  const listed = isComplete ? freeFirst(visible) : visible;
  const selected = activities.find((item) => item.id === selectedId);
  const toggle = (id: string) => {
    const next = toggleSaved(savedIds, id);
    setSavedIds(next);
    jsonStorage.write(storageKey, next);
  };
  const openDetail = (id: string) => {
    setSelectedId(id);
    setReturnView(view === "saved" ? "saved" : "list");
    setView("detail");
  };

  if (view === "detail" && selected) {
    const saved = savedIds.includes(selected.id);
    return (
      <section className="stack">
        <button
          aria-label="활동 목록으로 돌아가기"
          className="icon-button detail-back"
          onClick={() => setView(returnView)}
          type="button"
        >
          <Icon name="arrow-left" />
        </button>
        <article className="surface activity-detail">
          <div className="activity-visual">
            <span className="activity-visual-icon">
              <Icon name={activityIcon(selected)} size={25} />
            </span>
            <span className="activity-visual-label">WEEKEND PICK</span>
          </div>
          <div className="activity-detail-copy">
            <div>
              <span className="status-chip">
                {selected.category}
                {selected.free ? " · 무료" : ""}
              </span>
              <h2>{selected.name}</h2>
              <p className="activity-description">{selected.description}</p>
            </div>
            <div className="detail-info-grid">
              <div className="detail-info">
                <small>추천 지역</small>
                <strong>{selected.area}</strong>
              </div>
              <div className="detail-info">
                <small>예상 시간</small>
                <strong>{selected.duration}</strong>
              </div>
            </div>
            <Button display="full" onClick={() => toggle(selected.id)}>
              {saved ? "저장 취소하기" : "내 주말에 저장하기"}
            </Button>
          </div>
        </article>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="weekend-summary">
        <div>
          <p>이번 주말 후보</p>
          <strong>
            {savedIds.length > 0
              ? `${savedIds.length}개의 활동을 골랐어요`
              : "가볍게 하나 골라볼까요?"}
          </strong>
        </div>
        <div className="weekend-count" aria-label={`저장 ${savedIds.length}개`}>
          <div>
            <b>{savedIds.length}</b>
            <span>SAVED</span>
          </div>
        </div>
      </div>

      <nav className="segmented" aria-label="활동 보기">
        <button
          aria-pressed={view === "list"}
          className={view === "list" ? "segment active" : "segment"}
          onClick={() => setView("list")}
          type="button"
        >
          둘러보기
        </button>
        <button
          aria-pressed={view === "saved"}
          className={view === "saved" ? "segment active" : "segment"}
          onClick={() => setView("saved")}
          type="button"
        >
          저장한 활동 {savedIds.length}
        </button>
      </nav>

      {view === "list" && (
        <div className="pill-row" aria-label="활동 카테고리">
          {categories.map((item) => (
            <button
              aria-pressed={category === item}
              className={category === item ? "pill active" : "pill"}
              key={item}
              onClick={() => setCategory(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <div className="section-head">
        <h2>{view === "saved" ? "내가 고른 활동" : "주말 아이디어"}</h2>
        <p>
          {isComplete && view === "list"
            ? "무료 추천부터"
            : `${listed.length}개`}
        </p>
      </div>

      {listed.length === 0 ? (
        <div className="surface empty-state">
          <div>
            <span className="empty-state-icon">
              <Icon name="bookmark" size={28} />
            </span>
            <h2>아직 저장한 활동이 없어요</h2>
            <p>둘러보기에서 마음에 드는 주말을 골라보세요.</p>
            <button
              className="secondary-button"
              onClick={() => setView("list")}
              type="button"
            >
              활동 둘러보기
            </button>
          </div>
        </div>
      ) : (
        <div className="activity-list">
          {listed.map((item) => {
            const saved = savedIds.includes(item.id);
            return (
              <article className="activity-card" key={item.id}>
                <div className="activity-visual">
                  <span className="activity-visual-icon">
                    <Icon name={activityIcon(item)} size={24} />
                  </span>
                  <span className="activity-visual-label">WEEKEND PICK</span>
                </div>
                <div className="activity-body">
                  <span className="status-chip">
                    {item.category}
                    {item.free ? " · 무료" : ""}
                  </span>
                  <h2>{item.name}</h2>
                  <p className="activity-description">{item.description}</p>
                  <div className="activity-meta">
                    <span>
                      <Icon name="pin" size={15} />
                      {item.area}
                    </span>
                    <span>
                      <Icon name="clock" size={15} />
                      {item.duration}
                    </span>
                  </div>
                  <div className="activity-actions">
                    <button
                      className="text-action"
                      onClick={() => openDetail(item.id)}
                      type="button"
                    >
                      자세히 보기
                    </button>
                    <button
                      aria-label={
                        saved ? `${item.name} 저장 취소` : `${item.name} 저장`
                      }
                      aria-pressed={saved}
                      className={saved ? "icon-button active" : "icon-button"}
                      onClick={() => toggle(item.id)}
                      type="button"
                    >
                      <Icon name="bookmark" size={19} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
