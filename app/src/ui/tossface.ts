export const tossfaceAssets = {
  cityscape: "cityscape.svg",
  books: "books.svg",
  croissant: "croissant.svg",
  fire: "fire.svg",
  seedling: "seedling.svg",
  smile: "smile.svg",
  compass: "compass.svg",
  map: "map.svg",
  plant: "plant.svg",
  candle: "candle.svg",
  gift: "gift.svg",
  tea: "tea.svg",
  cake: "cake.svg",
  tumbler: "tumbler.svg",
} as const;

export type TossfaceName = keyof typeof tossfaceAssets;

export const tossfaceSrc = (name: TossfaceName) =>
  `/tossface/${tossfaceAssets[name]}`;
