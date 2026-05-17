import type { ReactNode } from "react";
import { PhoneFrame } from "./PhoneFrame";

type MobilePrototypeFrameProps = {
  children: ReactNode;
};

/** @deprecated Use PhoneFrame */
export function MobilePrototypeFrame({ children }: MobilePrototypeFrameProps) {
  return <PhoneFrame>{children}</PhoneFrame>;
}
