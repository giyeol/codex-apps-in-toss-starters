export const kits = [
  {
    id: "01-weekend-activities",
    packageName: "weekend-activities-starter",
    displayName: "주말 활동 모음",
    demoAppName: "course-weekend-activities",
    feature: "weekendActivities",
    primaryColor: "#D9593D",
    tagline: "가까운 곳에서 시작하는 나만의 주말",
  },
  {
    id: "02-habit-challenge",
    packageName: "habit-challenge-starter",
    displayName: "7일 습관 챌린지",
    demoAppName: "course-habit-challenge",
    feature: "habitChallenge",
    primaryColor: "#14805E",
    tagline: "작게 시작하고, 매일 이어가는 변화",
  },
  {
    id: "03-travel-style-test",
    packageName: "travel-style-test-starter",
    displayName: "여행 스타일 테스트",
    demoAppName: "course-travel-style-test",
    feature: "travelStyleTest",
    primaryColor: "#6652CC",
    tagline: "여섯 번의 선택으로 만나는 나의 여행 방식",
  },
  {
    id: "04-gift-finder",
    packageName: "gift-finder-starter",
    displayName: "상황별 선물 찾기",
    demoAppName: "course-gift-finder",
    feature: "giftFinder",
    primaryColor: "#C7475D",
    tagline: "고민은 줄이고, 전하고 싶은 마음은 선명하게",
  },
];

export const flavors = [
  { id: "starter", outputDirectory: "starter-kits" },
  { id: "complete", outputDirectory: "complete-examples" },
];

export function targetMatrix() {
  return kits.flatMap((kit) => flavors.map((flavor) => ({ kit, flavor })));
}
