'use client';

import { useCallback, useState } from 'react';
import { UnifiedExperience } from '@/components/experience/UnifiedExperience';
import { OpticalIntro } from './OpticalIntro';
import styles from './optical.module.css';

/** The real homepage stays mounted; only its prelude layer is conditional. */
export function OpticalExperience({ previewControls = false }: { previewControls?: boolean } = {}) {
  const [complete, setComplete] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [replay, setReplay] = useState(0);
  const reveal = useCallback(() => setRevealing(true), []);
  const finish = useCallback(() => { setRevealing(true); setComplete(true); }, []);
  return <div className={styles.experiment} data-optical-experiment data-optical-complete={complete}>
    <UnifiedExperience introPending={!complete} deferHeroIntro={!revealing} />
    {!complete && <OpticalIntro forceReplay={replay>0} onReveal={reveal} onComplete={finish} />}
    {complete && previewControls && <button className={styles.replay} onClick={() => {
      setReplay(value=>value+1); setRevealing(false); setComplete(false);
    }}>Replay intro</button>}
  </div>;
}
