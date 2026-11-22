import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, FastForward, Flame, Undo, ZoomIn, ArrowLeft, Globe2, CircleDot, Sun, Moon } from 'lucide-react';
import styles from './SystemTopNav.module.css';

interface SystemTopNavProps {
  collapsed: boolean;
  paused: boolean;
  speedMultiplier: number;
  shadowsEnabled: boolean;
  focusedBodyId?: string;
  focusedBodyName?: string;
  onToggleCollapse: () => void;
  onDiveToSun: () => void;
  onTogglePause: () => void;
  onStepSpeed: () => void;
  onToggleShadows: () => void;
}

export const SystemTopNav: React.FC<SystemTopNavProps> = ({
  collapsed,
  paused,
  speedMultiplier,
  shadowsEnabled,
  focusedBodyId,
  focusedBodyName,
  onToggleCollapse,
  onDiveToSun,
  onTogglePause,
  onStepSpeed,
  onToggleShadows,
}) => {
  return (
    <div className={styles.top}>
      <div className={styles.titleArea}>
        <div className={styles.navRow}>
          <Link to="/" className={styles.navLink} title="Back to Hub">
            <ArrowLeft size={14} />
            <span>Hub</span>
          </Link>
          <Link to="/black-hole" className={styles.navLink} title="View Schwarzschild Black Hole">
            <CircleDot size={14} />
            <span>Gargantua</span>
          </Link>
          {focusedBodyId && (
            <Link
              to={`/bodies?id=${focusedBodyId}`}
              className={styles.inspectBtn}
              title={`Inspect ${focusedBodyName || 'body'} in high-fidelity 3D`}
            >
              <Globe2 size={14} />
              <span>Inspect {focusedBodyName}</span>
            </Link>
          )}
        </div>
        <h1 className={styles.title}>Solar System</h1>
        <span className={styles.subtitle}>Drag to orbit • Right-click or Space+drag to pan • WASD to fly</span>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.speedBtn}
          onClick={onToggleShadows}
          title={shadowsEnabled ? 'Turn shadows off (Full illumination)' : 'Turn shadows on (Natural day/night)'}
        >
          {shadowsEnabled ? <Moon size={14} /> : <Sun size={14} />}
          <span>{shadowsEnabled ? 'Shadows: ON' : 'Shadows: OFF'}</span>
        </button>
        <button className={styles.collapseBtn} onClick={onToggleCollapse}>
          {collapsed ? <Undo size={14} /> : <Flame size={14} />}
          <span>{collapsed ? 'Restore Sun' : 'Collapse Sun'}</span>
        </button>
        <button className={styles.speedBtn} onClick={onDiveToSun} title="Dive toward Sun">
          <ZoomIn size={14} />
          <span>Dive</span>
        </button>
        <button className={styles.speedBtn} onClick={onTogglePause} title={paused ? 'Resume' : 'Pause'}>
          {paused ? <Play size={14} /> : <Pause size={14} />}
          <span>{paused ? 'Paused' : `${speedMultiplier}d/s`}</span>
        </button>
        <button className={styles.speedBtn} onClick={onStepSpeed} title="Cycle Speed">
          <FastForward size={14} />
        </button>
      </div>
    </div>
  );
};
