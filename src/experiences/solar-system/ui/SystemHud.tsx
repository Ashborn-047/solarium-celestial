import React from 'react';
import { Chip } from '../../../shared/ui/Chip';
import { SystemNode } from '../engine/system-builder';
import { LabelItem } from '../engine/labels';
import { SystemTopNav } from './SystemTopNav';
import styles from './SystemHud.module.css';

interface SystemHudProps {
  focusedNode: SystemNode | null;
  primaryNodes: SystemNode[];
  selectedRelNode: SystemNode | null;
  labels: LabelItem[];
  paused: boolean;
  speedMultiplier: number;
  collapsed: boolean;
  onTogglePause: () => void;
  onStepSpeed: () => void;
  onToggleCollapse: () => void;
  onDiveToSun: () => void;
  onSelectNode: (node: SystemNode | null) => void;
}

export const SystemHud: React.FC<SystemHudProps> = ({
  focusedNode,
  primaryNodes,
  selectedRelNode,
  labels,
  paused,
  speedMultiplier,
  collapsed,
  onTogglePause,
  onStepSpeed,
  onToggleCollapse,
  onDiveToSun,
  onSelectNode,
}) => {
  const currentData = focusedNode?.data;
  const moons = selectedRelNode?.children || [];

  return (
    <>
      <SystemTopNav
        collapsed={collapsed}
        paused={paused}
        speedMultiplier={speedMultiplier}
        focusedBodyId={currentData?.id}
        focusedBodyName={currentData?.name}
        onToggleCollapse={onToggleCollapse}
        onDiveToSun={onDiveToSun}
        onTogglePause={onTogglePause}
        onStepSpeed={onStepSpeed}
      />

      <div className={styles.labelsLayer}>
        {labels.map(
          (lbl) =>
            lbl.visible && (
              <button
                key={lbl.id}
                className={`${styles.labelBtn} ${lbl.isFocused ? styles.labelActive : ''}`}
                style={{ transform: `translate(${lbl.x}px, ${lbl.y}px)` }}
                onClick={() => onSelectNode(lbl.node)}
              >
                {lbl.name}
              </button>
            )
        )}
      </div>

      <div className={styles.dock}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{currentData ? currentData.name : 'Solar System'}</h2>
          <p className={styles.cardNote}>
            {currentData
              ? currentData.note
              : 'Eight planets, a dwarf planet and 24 moons with high-fidelity texture maps. Distances and sizes compressed to fit. Tap a name to fly there; drag to orbit.'}
          </p>
          {currentData && (
            <dl className={styles.cardFacts}>
              {currentData.diameter && (
                <>
                  <dt className={styles.factLabel}>Diameter</dt>
                  <dd className={styles.factValue}>{currentData.diameter}</dd>
                </>
              )}
              {currentData.distance && (
                <>
                  <dt className={styles.factLabel}>Distance</dt>
                  <dd className={styles.factValue}>{currentData.distance}</dd>
                </>
              )}
              {currentData.orbitDesc && (
                <>
                  <dt className={styles.factLabel}>Orbit</dt>
                  <dd className={styles.factValue}>{currentData.orbitDesc}</dd>
                </>
              )}
              {currentData.moonCount && (
                <>
                  <dt className={styles.factLabel}>Moons</dt>
                  <dd className={styles.factValue}>{currentData.moonCount}</dd>
                </>
              )}
            </dl>
          )}
        </div>

        {moons.length > 0 && (
          <div className={styles.row}>
            {moons.map((moon) => (
              <Chip
                key={moon.data.id}
                label={moon.data.name}
                active={focusedNode === moon}
                onClick={() => onSelectNode(moon)}
              />
            ))}
          </div>
        )}

        <div className={styles.row}>
          <Chip label="Overview" active={!focusedNode} onClick={() => onSelectNode(null)} />
          {primaryNodes.map((node) => (
            <Chip
              key={node.data.id}
              label={node.data.name}
              active={focusedNode === node || selectedRelNode === node}
              onClick={() => onSelectNode(node)}
            />
          ))}
        </div>
      </div>
    </>
  );
};
