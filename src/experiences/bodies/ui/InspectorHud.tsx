import React from 'react';
import { BodyData } from '../../../shared/types/body';
import { Chip } from '../../../shared/ui/Chip';
import styles from './InspectorHud.module.css';

interface InspectorHudProps {
  currentBody: BodyData;
  primaryBodies: BodyData[];
  selectedPrimary: BodyData;
  onSelectPrimary: (body: BodyData) => void;
  onSelectMoon: (moon: BodyData) => void;
  loading: boolean;
  loadingName: string;
}

export const InspectorHud: React.FC<InspectorHudProps> = ({
  currentBody,
  primaryBodies,
  selectedPrimary,
  onSelectPrimary,
  onSelectMoon,
  loading,
  loadingName,
}) => {
  const moons = selectedPrimary.children || [];

  return (
    <>
      <div className={styles.top}>
        <h1 className={styles.title}>Solar bodies</h1>
        <span className={styles.hint}>Drag to orbit. Pinch to zoom.</span>
      </div>

      <div className={`${styles.busy} ${loading ? styles.busyOn : ''}`}>
        Loading {loadingName}
      </div>

      <div className={styles.dock}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.name}>{currentBody.name}</h2>
          </div>
          {currentBody.note && <p className={styles.note}>{currentBody.note}</p>}
          {currentBody.facts && (
            <dl className={styles.facts}>
              {currentBody.facts.map(([k, v]) => (
                <React.Fragment key={k}>
                  <dt className={styles.factLabel}>{k}</dt>
                  <dd className={styles.factValue}>{v}</dd>
                </React.Fragment>
              ))}
            </dl>
          )}
          <small className={styles.credit}>
            Maps: NASA mission data via Celestia, Three.js and threex.planets (J. Hastings-Trew).
          </small>
        </div>

        {moons.length > 0 && (
          <div className={styles.moonsRow}>
            {moons.map((moon) => (
              <Chip
                key={moon.id}
                label={moon.name}
                active={currentBody.id === moon.id}
                onClick={() => onSelectMoon(moon)}
              />
            ))}
          </div>
        )}

        <div className={styles.row}>
          {primaryBodies.map((body) => (
            <Chip
              key={body.id}
              label={body.name}
              active={selectedPrimary.id === body.id && currentBody.id === body.id}
              onClick={() => onSelectPrimary(body)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
