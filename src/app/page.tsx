import type { Metadata, Viewport } from "next";
import { UnifiedExperience } from "@/components/experience/UnifiedExperience";

export const metadata: Metadata = {
  title: "Cassy Wu — Product, UX & Interaction Design",
  description:
    "Cassy Wu — exploring human experiences across systems, human-AI interactions, product design, UX, and creative prototyping.",
};

export const viewport: Viewport = { themeColor: "#050505" };

export default function HomePage() {
  return <UnifiedExperience />;
}
