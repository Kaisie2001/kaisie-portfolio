'use client';
import styles from './KineticText.module.css';

// The original inline text stays in flow: kerning, spaces, line width, and the
// typing reveal all remain measurable without reading transformed glyph boxes.
export function KineticText({ text, shown = text.length, continuous = false }: { text: string; shown?: number; continuous?: boolean }) {
  return <>
    <span className={styles.source} data-kinetic-source="true">
      {continuous ? text : Array.from(text).map((character, index) => <span key={index} data-kinetic-anchor={index}
        style={{ visibility: index < shown ? 'visible' : 'hidden' }}>{character}</span>)}
    </span>
    <span className={styles.layer} data-kinetic-layer="true" aria-hidden="true">
      {Array.from(text).map((character, index) => <span key={index} className={styles.slot} data-kinetic-slot={index}
        style={{ visibility: index < shown ? 'visible' : 'hidden' }}>
        <span className={styles.ink} data-kinetic-glyph="true">{character === ' ' ? '\u00a0' : character}</span>
      </span>)}
    </span>
  </>;
}
