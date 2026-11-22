import React, { useEffect, useState } from 'react';
import { Sun, Undo, ZoomIn, ZoomOut, Eye, EyeOff } from 'lucide-react';
import styles from './Hud.module.css';

export interface HudProps {
  phaseTitle: string;
  phaseDesc: string;
  collapsed: boolean;
  diving: boolean;
  showDisk: boolean;
  onToggleCollapse: () => void;
  onToggleDive: () => void;
  onToggleDisk: () => void;
}

export const Hud: React.FC<HudProps> = ({
  phaseTitle,
  phaseDesc,
  collapsed,
  diving,
  showDisk,
  onToggleCollapse,
  onToggleDive,
  onToggleDisk,
}) => {
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={styles.vig} />

      <div className={styles.top}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>The Sun, collapsed</h1>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>{phaseTitle}</h2>
          <p className={styles.cardDesc}>{phaseDesc}</p>
          <small className={styles.cardNote}>
            Not to scale. The glow disk is artistic: a collapsed Sun would have none.
          </small>
        </div>
      </div>

      <div className={styles.dock}>
        <button className={styles.collapseBtn} onClick={onToggleCollapse}>
          {collapsed ? <Undo size={16} /> : <Sun size={16} />}
          <span>{collapsed ? 'Restore the Sun' : 'Collapse the Sun'}</span>
        </button>

        <button className={styles.dockBtn} onClick={onToggleDive}>
          {diving ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
          <span>{diving ? 'Pull back' : 'Dive in'}</span>
        </button>

        <button className={styles.dockBtn} onClick={onToggleDisk} disabled={!collapsed}>
          {showDisk ? <Eye size={16} /> : <EyeOff size={16} />}
          <span>Glow disk</span>
        </button>
      </div>

      <div className={`${styles.fade} ${faded ? styles.fadedOut : ''}`} />
    </>
  );
};
