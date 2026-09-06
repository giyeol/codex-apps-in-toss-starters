import { FixedBottomCTA, Top } from "@toss/tds-mobile";
import { useEffect, useRef, useState } from "react";
import { copy } from "../../content/gift";
import { jsonStorage } from "../../platform/storage";
import { TossfaceEmoji } from "../../ui/TossfaceEmoji";
import {
  AD_DELAY_MS,
  BOX_COUNT,
  drawAmount,
  emptyState,
  isGiftState,
  openBox,
  progress,
  type GiftState,
} from "./model";

const STORAGE_KEY = "course.gift.v1";

export function ActiveFeature() {
  const [state, setState] = useState<GiftState>(() =>
    jsonStorage.read(STORAGE_KEY, emptyState(), isGiftState),
  );
  const [watchingAd, setWatchingAd] = useState(false);
  const latest = useRef(state);
  latest.current = state;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const persist = (next: GiftState) => {
    setState(next);
    jsonStorage.write(STORAGE_KEY, next);
  };

  const open = (index: number) => {
    if (watchingAd || timer.current) return;
    setWatchingAd(true);
    const won = drawAmount(Math.random());
    timer.current = setTimeout(() => {
      timer.current = null;
      setWatchingAd(false);
      persist(openBox(latest.current, index, won));
    }, AD_DELAY_MS);
  };

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setWatchingAd(false);
    persist(emptyState());
  };

  const { opened, remaining, finished } = progress(state);
  const notice = finished
    ? copy.done
    : opened > 0
      ? copy.progress(opened, remaining)
      : copy.start;

  return (
    <section className="screen screen-enter gift-draw" data-demo="gift-draw">
      <Top subtitleBottom={copy.subtitle} title={copy.title} />
      <div className="gift-total">
        <span>{copy.totalLabel}</span>
        <strong data-demo="gift-total">{copy.won(state.total)}</strong>
      </div>
      <div aria-label="선물 상자" className="gift-grid" role="group">
        {Array.from({ length: BOX_COUNT }, (_, index) => {
          const hit = state.opened.find((box) => box.index === index);
          if (hit) {
            return (
              <div
                aria-label={copy.openedBoxLabel(index + 1, hit.won)}
                className="gift-box gift-box-open"
                data-demo={`gift-box-${index}`}
                key={index}
                role="img"
              >
                {copy.won(hit.won)}
              </div>
            );
          }
          return (
            <button
              aria-label={copy.boxLabel(index + 1)}
              className="gift-box touch-target"
              data-demo={`gift-box-${index}`}
              disabled={watchingAd}
              key={index}
              onClick={() => open(index)}
              type="button"
            >
              <TossfaceEmoji name="gift" size={40} />
            </button>
          );
        })}
      </div>
      <p className="gift-notice" data-demo="gift-notice" role="status">
        {notice}
      </p>
      <FixedBottomCTA data-demo="gift-reset" onClick={reset}>
        {copy.reset}
      </FixedBottomCTA>
      {watchingAd && (
        <div aria-live="polite" className="ad-overlay" role="status">
          <div>
            <strong>{copy.adTitle}</strong>
            <p>{copy.adNote}</p>
          </div>
        </div>
      )}
    </section>
  );
}
