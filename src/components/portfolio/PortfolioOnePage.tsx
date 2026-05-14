"use client";

import { useMemo } from "react";
import { FullscreenSectionSlider } from "@/components/FullscreenSectionSlider";
import { HomeHero } from "@/components/home/HomeHero";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { WorkSection } from "@/components/portfolio/WorkSection";
import { useLanguage } from "@/contexts/LanguageContext";
import { portfolioCopy } from "@/lib/portfolioCopy";

/**
 * Full-screen deck: Home, Work, About as slides (not a long scrolling stack).
 */
export function PortfolioOnePage() {
  const { lang } = useLanguage();
  const c = portfolioCopy[lang].home;
  const w = portfolioCopy[lang].work;

  const sections = useMemo(
    () => [
      {
        id: "home" as const,
        label: lang === "en" ? "Home" : "首页",
        content: (
          <section
            id="home"
            className="flex min-h-0 flex-1 flex-col"
            aria-label={lang === "en" ? "Home" : "首页"}
          >
            <HomeHero
              density="slide"
              title={c.title}
              subtitle={c.subtitle}
              oneLiner={c.oneLiner}
              capabilityTags={c.capabilityTags}
              focusLine={c.focusLine}
            />
          </section>
        ),
      },
      {
        id: "work" as const,
        label: lang === "en" ? "Work" : "作品",
        content: (
          <WorkSection
            lang={lang}
            density="slide"
            featuredTitle={w.featuredTitle}
            featuredLead={w.slideIntro}
            additionalTitle={w.additionalTitle}
            featured={w.featured}
            additional={w.additional}
          />
        ),
      },
      {
        id: "about" as const,
        label: lang === "en" ? "About" : "关于",
        content: <AboutSection lang={lang} density="slide" />,
      },
    ],
    [c, lang, w],
  );

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <FullscreenSectionSlider sections={sections} />
    </div>
  );
}
