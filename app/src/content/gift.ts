/** 화면에 보이는 글이에요. 내 주제로 바꿀 때 이 파일부터 고쳐요. */
export const copy = {
  title: "선물 뽑기",
  subtitle: "상자를 열면 1~3원이 쌓여요. 9개 다 열면 바꿀 수 있어요.",
  totalLabel: "쌓인 금액",
  won: (amount: number) => `${amount}원`,
  start: "상자를 하나 골라 보세요.",
  progress: (opened: number, remaining: number) =>
    `${opened}개 열었어요. ${remaining}개 남았어요.`,
  done: "9개 다 열었어요! 실제 앱에서는 여기서 토스 포인트로 교환해요.",
  adTitle: "광고 보는 중…",
  adNote: "실제 앱에서는 여기서 광고가 나와요",
  reset: "처음부터",
  boxLabel: (number: number) => `${number}번 상자 열기`,
  openedBoxLabel: (number: number, amount: number) =>
    `${number}번 상자, ${amount}원`,
};
