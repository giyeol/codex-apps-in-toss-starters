import type { CSSProperties } from "react";
import { tossfaceSrc, type TossfaceName } from "./tossface";

type Props = {
  name: TossfaceName;
  size?: number;
  alt?: string;
  className?: string;
};

export function TossfaceEmoji({ name, size = 40, alt, className }: Props) {
  const style = { "--tossface-size": `${size}px` } as CSSProperties;
  return (
    <img
      alt={alt ?? ""}
      aria-hidden={alt === undefined}
      className={["tossface-emoji", className].filter(Boolean).join(" ")}
      draggable={false}
      height={size}
      src={tossfaceSrc(name)}
      style={style}
      width={size}
    />
  );
}
