"use client";

import { PortfolioOnePage } from "@/components/portfolio/PortfolioOnePage";
import { SplashIntro } from "@/components/SplashIntro";

export default function HomePage() {
  return (
    <SplashIntro>
      <PortfolioOnePage />
    </SplashIntro>
  );
}
