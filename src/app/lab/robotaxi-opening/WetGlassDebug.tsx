import RainAtmosphere from './RainAtmosphere';
import styles from './opening.module.css';
/** Developer-only material comparison: no fog, mask, copy or opening sequence. */
export default function WetGlassDebug({wet,enhanced=true,mode='full'}:{wet:boolean;enhanced?:boolean;mode?:'impact'|'flow'|'full'}){
  return <section className={styles.window} aria-label={wet?'Wet glass material debug':'Legacy glass material debug'}>
    <link rel="stylesheet" href="/fonts/hero/misans.css" precedence="default"/>
    <div className={styles.street}/>
    <RainAtmosphere wet={wet} enhanced={enhanced} rainMode={mode}/>
  </section>;
}
