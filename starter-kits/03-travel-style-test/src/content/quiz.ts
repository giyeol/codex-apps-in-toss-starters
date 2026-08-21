export type Choice = { label: string; hint: string; score: number };
export type Question = { prompt: string; choices: Choice[] };
export const questions: Question[] = [
  {
    prompt: "일정은 어떻게 정하나요?",
    choices: [
      { label: "여유롭게", hint: "큰 일정 하나면 충분해요", score: 0 },
      { label: "적당히", hint: "가고 싶은 곳 몇 개만 골라요", score: 1 },
      { label: "빽빽하게", hint: "시간대별로 계획해요", score: 3 },
    ],
  },
  {
    prompt: "맛집은 어떻게 찾나요?",
    choices: [
      { label: "현장에서", hint: "눈에 띄는 곳으로 들어가요", score: 0 },
      { label: "후보만", hint: "두세 곳을 미리 찾아둬요", score: 1 },
      { label: "예약까지", hint: "실패 없도록 자리를 잡아둬요", score: 3 },
    ],
  },
  {
    prompt: "이동은 어떻게 하나요?",
    choices: [
      { label: "발길 닿는 대로", hint: "걷다가 끌리는 곳으로 가요", score: 0 },
      { label: "상황에 맞게", hint: "거리와 날씨를 함께 봐요", score: 1 },
      { label: "동선부터", hint: "가장 효율적인 길을 정해요", score: 3 },
    ],
  },
  {
    prompt: "사진은 얼마나 남기나요?",
    choices: [
      { label: "순간만", hint: "기억에 남을 장면만 찍어요", score: 0 },
      { label: "몇 장", hint: "사람과 풍경을 고루 남겨요", score: 1 },
      { label: "명소마다", hint: "방문한 곳마다 기록해요", score: 3 },
    ],
  },
  {
    prompt: "숙소는 언제 정하나요?",
    choices: [
      { label: "도착해서", hint: "마음에 드는 동네에서 찾아요", score: 0 },
      { label: "적당히 미리", hint: "출발 전에는 정해둬요", score: 1 },
      { label: "미리 예약", hint: "후기와 위치까지 비교해요", score: 3 },
    ],
  },
  {
    prompt: "돌발 상황을 만나면?",
    choices: [
      { label: "그것도 즐겨요", hint: "예상 밖의 경험도 여행이에요", score: 0 },
      { label: "조율해요", hint: "계획을 조금 바꿔 이어가요", score: 1 },
      { label: "대안을 찾아요", hint: "준비한 다음 선택지로 가요", score: 3 },
    ],
  },
];
export const results = [
  {
    id: "explorer",
    min: 0,
    max: 5,
    name: "즉흥 탐험가",
    description: "계획보다 그날의 분위기를 따라갈 때 여행이 더 즐거워요.",
    keywords: ["우연한 발견", "느긋한 일정", "로컬 산책"],
    note: "첫날만 정해두고 나머지는 현지에서 골라보세요.",
  },
  {
    id: "balance",
    min: 6,
    max: 12,
    name: "균형 잡힌 여행자",
    description: "꼭 하고 싶은 일은 챙기고, 빈틈에서는 새로운 선택을 즐겨요.",
    keywords: ["핵심 일정", "유연한 선택", "적당한 준비"],
    note: "하루에 한 곳만 고정하면 가장 편안한 여행이 돼요.",
  },
  {
    id: "planner",
    min: 13,
    max: 18,
    name: "꼼꼼한 플래너",
    description:
      "잘 짜인 동선과 예약이 있을 때 여행에 온전히 집중할 수 있어요.",
    keywords: ["효율적인 동선", "사전 예약", "알찬 기록"],
    note: "계획표에 한 시간의 여유를 남기면 돌발 상황도 즐길 수 있어요.",
  },
];
