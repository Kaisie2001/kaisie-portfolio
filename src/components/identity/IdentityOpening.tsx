'use client';

import { useCallback, useState } from 'react';
import { UnifiedExperience } from '@/components/experience/UnifiedExperience';
import { ModularIntro } from './ModularIntro';
import styles from './identity.module.css';

/** Lab host: exactly one instance of the production experience, never keyed. */
export function IdentityOpening() {
  const [complete, setComplete] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const reveal = useCallback(() => setRevealing(true), []);
  const finish = useCallback(() => { setRevealing(true); setComplete(true); }, []);
  return <div className={styles.experiment} data-identity-experiment data-intro-complete={complete}>
    <UnifiedExperience introPending={!complete} deferHeroIntro={!revealing} />
    {!complete && <ModularIntro onReveal={reveal} onComplete={finish} />}
    {complete && <button className={styles.replay} onClick={() => { setRevealing(false); setComplete(false); }}>Replay intro</button>}
  </div>;
}
