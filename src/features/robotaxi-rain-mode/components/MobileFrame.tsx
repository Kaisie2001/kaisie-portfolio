import type { ReactNode } from "react";
import { MobilePrototypeFrame } from "./MobilePrototypeFrame";

type MobileFrameProps = {
  children: ReactNode;
  title?: string;
};

export function MobileFrame({ children }: MobileFrameProps) {
  return <MobilePrototypeFrame>{children}</MobilePrototypeFrame>;
}
