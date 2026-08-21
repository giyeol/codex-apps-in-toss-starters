import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "ad"
  | "arrow-left"
  | "bookmark"
  | "calendar"
  | "chart"
  | "check"
  | "chevron-down"
  | "clock"
  | "compass"
  | "copy"
  | "gift"
  | "pin"
  | "refresh"
  | "sparkle"
  | "walk";

type Props = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: IconName;
  size?: number;
};

const paths: Record<IconName, ReactNode> = {
  ad: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M7 15l2.2-6h1.6l2.2 6M7.8 13h4.4M16 9v6M16 9h1.2a2.8 2.8 0 010 6H16" />
    </>
  ),
  "arrow-left": <path d="M19 12H5m6-6l-6 6 6 6" />,
  bookmark: (
    <path d="M7 4.8A1.8 1.8 0 018.8 3h6.4A1.8 1.8 0 0117 4.8V21l-5-3.1L7 21V4.8z" />
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4m8-4v4M3 10h18" />
    </>
  ),
  chart: <path d="M5 20V10m7 10V4m7 16v-7" />,
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  "chevron-down": <path d="M7 9l5 5 5-5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.7 8.3l-2.1 5.3-5.3 2.1 2.1-5.3 5.3-2.1z" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
    </>
  ),
  gift: (
    <>
      <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13" />
      <path d="M12 7H8.5A2.5 2.5 0 118.5 2C11 2 12 7 12 7zm0 0h3.5a2.5 2.5 0 100-5C13 2 12 7 12 7z" />
    </>
  ),
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  refresh: (
    <path d="M20 7v5h-5M4 17v-5h5m9.5-3A7 7 0 006.8 6.8L4 9m16 6l-2.8 2.2A7 7 0 015.5 15" />
  ),
  sparkle: (
    <path d="M12 2l1.5 5.2L19 9l-5.5 1.8L12 16l-1.5-5.2L5 9l5.5-1.8L12 2zm7 13l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15z" />
  ),
  walk: (
    <>
      <circle cx="14" cy="4.5" r="2" />
      <path d="M10 21l2-6-3-3 2.5-4 3 2 3 .5M12 15l4 2 1 4M8 10l-3 4" />
    </>
  ),
};

export function Icon({ name, size = 20, ...props }: Props) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
