'use client';
import { useEffect, useState } from 'react';
import styles from './HeroSection.module.css';
import { LineArtPortrait } from './LineArtPortrait';
import { TranslationLens } from './TranslationLens';
import { KineticText } from './KineticText';
import { HeroActivity } from './HeroActivity';

const lines = ['CURIOUS', 'ACROSS DISCIPLINES.', 'FOCUSED ON', 'REAL PROBLEMS.'];
const seenKey = 'cassy-hero-v1-read';
const languageKey = 'portfolio-lang';
const letterCount = lines.reduce((sum, text) => sum + text.length, 0);
// Standalone lab page: no dependency on the host project's optional components/providers.
// Retain the site's language preference key for later integration.
export function HeroSection({ active = true, onLanguageChange }: { active?: boolean; onLanguageChange?: (lang: 'en' | 'zh') => void } = {}) {
  const [lang, setLanguage] = useState<'en' | 'zh'>('en');
  const [revealed, setRevealed] = useState(letterCount);
  const complete = revealed >= letterCount;
  useEffect(() => {
    try {
      const saved = localStorage.getItem(languageKey);
      if (saved === 'en' || saved === 'zh') setLanguage(saved);
    } catch { /* Storage can be disabled in private browsing. */ }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    const finish = () => {
      if (timer !== undefined) clearTimeout(timer);
      setRevealed(letterCount);
      try { localStorage.setItem(seenKey, '1'); } catch {}
    };
    if (!active) { finish(); return; }
    let seen = false;
    try { seen = localStorage.getItem(seenKey) === '1'; } catch {}
    if (!seen && !media.matches) {
      setRevealed(0);
      let count = 0;
      const boundaries = lines.slice(0, -1).map((_, index) =>
        lines.slice(0, index + 1).reduce((sum, text) => sum + text.length, 0));
      const tick = () => {
        if (cancelled) return;
        count += 1;
        setRevealed(count);
        if (count >= letterCount) finish();
        else timer = setTimeout(tick, boundaries.includes(count) ? 120 : 22);
      };
      timer = setTimeout(tick, 120);
    }
    const change = () => { if (media.matches) finish(); };
    media.addEventListener('change', change);
    return () => {
      cancelled = true;
      if (timer !== undefined) clearTimeout(timer);
      media.removeEventListener('change', change);
    };
  }, [active]);
  useEffect(() => { onLanguageChange?.(lang); }, [lang, onLanguageChange]);
  const setLang = (next: 'en' | 'zh') => {
    setLanguage(next);
    try { localStorage.setItem(languageKey, next); } catch {}
  };
  const zh = lang === 'zh';
  const links = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kaixin-wu-19988137b/' },
    { label: 'Email', href: 'mailto:wkx786873449@gmail.com' },
    { label: 'Resume', href: zh ? '/resume-ai-product-zh.pdf' : '/resume-ai-product-en.pdf' },
  ];
  return <HeroActivity.Provider value={active}><link rel="stylesheet" href="/fonts/hero/misans.css" precedence="default" /><section className={styles.hero} aria-label="Cassy Wu — About" data-hero-version="3-phase1" data-animation-complete={complete} lang={zh ? 'zh-CN' : 'en'}>
    <header className={styles.header}>
      <span className={styles.name}>Cassy Wu</span>
      <span className={styles.discipline}>PRODUCT / UX / INTERACTION</span>
      <div className={styles.languages} aria-label="Language">
        <button aria-pressed={!zh} onClick={() => setLang('en')}>EN</button><span>/</span>
        <button aria-pressed={zh} onClick={() => setLang('zh')}>中文</button>
      </div>
    </header>
    <div className={styles.composition}>
      <div className={styles.portraitArea}>
        <div className={`${styles.portraitStage} ${styles.lineStage}`}>
          <LineArtPortrait language={zh ? 'zh' : 'en'} label={zh ? 'Cassy Wu 的短发侧脸线稿，持续绘制' : 'Cassy Wu — continuously drawn short-bob side profile'} />
        </div>
      </div>
      <div className={styles.editorial}>
        <TranslationLens className={styles.title}>
          {lines.map((text, index) => <span key={text} data-lens-phrase={index} className={`${styles.line} ${index > 1 ? styles.red : ''}`} aria-hidden="true">
            <KineticText text={text} shown={Math.max(0, revealed - lines.slice(0, index).reduce((sum, value) => sum + value.length, 0))} />
          </span>)}
        </TranslationLens>
        <div className={`${styles.intro} ${complete ? styles.visible : ''}`}>
          <p>{zh ? '我关注人们如何体验身边的系统，从日常生活，到 AI 驱动的产品。' : "I'm interested in how people experience the systems around them — from everyday life to AI-powered products."}</p>
          <p>{zh ? '我结合研究、产品思考与原型实践，将真实世界中的观察转化为更清晰、更直观的交互。' : 'I combine research, product thinking and prototyping to turn real-world observations into clearer, more intuitive interactions.'}</p>
        </div>
        <div className={`${styles.information} ${complete ? styles.visible : ''}`}>
          <div><h2>FOCUS</h2><ul>{(zh ? ['产品设计', '用户体验设计', '交互设计'] : ['Product Design', 'UX Design', 'Interaction Design']).map(x => <li key={x}>{x}</li>)}</ul></div>
          <div><h2>INTERESTS</h2><ul>{(zh ? ['人机交互', '人与 AI 的交互', '设计研究', '服务系统'] : ['Human-Computer Interaction', 'Human-AI Interaction', 'Design Research', 'Service Systems']).map(x => <li key={x}>{x}</li>)}</ul></div>
          <div><h2>LINKS</h2><ul>{links.map(x => <li key={x.label}><a href={x.href} target={x.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">{x.label}<span aria-hidden="true"> ↗</span></a></li>)}</ul></div>
        </div>
      </div>
    </div>
  </section></HeroActivity.Provider>;
}
