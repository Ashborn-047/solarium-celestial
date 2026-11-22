import React from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Plus,
  Minus,
  Flame,
  Undo,
  ZoomIn,
  ArrowLeft,
  Globe2,
  CircleDot,
  Sun,
  Moon,
} from 'lucide-react';
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
  onStepSpeed: (delta?: number) => void;
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

        <div className={styles.speedControlGroup}>
          <button
            className={styles.speedSubBtn}
            onClick={() => onStepSpeed(-1)}
            title="Slower simulation speed"
          >
            <Minus size={13} />
          </button>
          <button
            className={styles.speedInnerBtn}
            onClick={onTogglePause}
            title={paused ? 'Resume simulation' : 'Pause simulation'}
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
            <span>{paused ? 'Paused' : `${speedMultiplier}d/s`}</span>
          </button>
          <button
            className={styles.speedSubBtn}
            onClick={() => onStepSpeed(1)}
            title="Faster simulation speed"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
