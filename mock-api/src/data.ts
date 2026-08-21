import type { Gift } from "./types";

export const gifts: readonly Gift[] = [
  { id: "dessert", name: "디저트 박스", reason: "달콤한 축하 선물로 잘 어울려요", priceRange: "20000-30000", emoji: "🍰", recipients: ["friend"], budgets: ["under-30000"], occasions: ["birthday"] },
  { id: "tea", name: "작은 티 세트", reason: "가볍게 마음을 전하기 좋아요", priceRange: "20000-30000", emoji: "🍵", recipients: ["friend", "colleague"], budgets: ["under-30000"], occasions: ["thanks"] },
  { id: "plant", name: "미니 화분", reason: "새 공간에 생기를 더해줘요", priceRange: "30000-50000", emoji: "🪴", recipients: ["family"], budgets: ["30000-50000"], occasions: ["housewarming"] },
  { id: "candle", name: "향초", reason: "편안한 분위기를 선물해요", priceRange: "30000-50000", emoji: "🕯️", recipients: ["colleague"], budgets: ["30000-50000"], occasions: ["thanks", "housewarming"] },
  { id: "tumbler", name: "텀블러", reason: "매일 실용적으로 쓰기 좋아요", priceRange: "50000+", emoji: "🥤", recipients: ["family", "colleague"], budgets: ["over-50000"], occasions: ["birthday", "thanks"] },
  { id: "towel", name: "핸드타월 세트", reason: "부담 없이 건네기 좋은 실용적인 선물이에요", priceRange: "20000-30000", emoji: "🎁", recipients: ["colleague", "family"], budgets: ["under-30000"], occasions: ["thanks", "housewarming"] }
];
