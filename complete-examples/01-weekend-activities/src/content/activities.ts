export type Activity = {
  id: string;
  name: string;
  category: string;
  description: string;
  area: string;
  duration: string;
  free?: boolean;
};
export const activities: Activity[] = [
  {
    id: "book",
    name: "동네 독립서점 산책",
    category: "실내",
    description: "작은 서가를 천천히 둘러보고 마음에 드는 책 한 권을 골라요.",
    area: "연남·망원",
    duration: "약 1시간",
    free: true,
  },
  {
    id: "picnic",
    name: "노을 한강 피크닉",
    category: "야외",
    description: "가벼운 간식과 돗자리만 챙겨 강바람을 느끼며 쉬어가요.",
    area: "망원한강공원",
    duration: "약 2시간",
    free: true,
  },
  {
    id: "exhibit",
    name: "동네 작은 전시",
    category: "실내",
    description: "북적이지 않는 전시 공간에서 새로운 취향을 발견해요.",
    area: "성수·을지로",
    duration: "약 90분",
  },
  {
    id: "bakery",
    name: "숨은 빵집 탐방",
    category: "동네",
    description: "평소 지나치던 골목에서 갓 구운 빵과 커피를 즐겨요.",
    area: "우리 동네",
    duration: "약 1시간",
  },
  {
    id: "board",
    name: "보드게임 한 판",
    category: "실내",
    description: "친구와 가볍게 몰입할 수 있는 게임 한 판을 골라봐요.",
    area: "신촌·건대",
    duration: "약 2시간",
  },
  {
    id: "walk",
    name: "도심 야경 산책",
    category: "야외",
    description: "해가 진 뒤 조용한 산책로를 걸으며 한 주를 정리해요.",
    area: "낙산·남산",
    duration: "약 1시간",
    free: true,
  },
];
