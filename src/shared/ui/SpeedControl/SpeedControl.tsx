import React from 'react';
import { ChevronsLeft, ChevronsRight, Play, Pause } from 'lucide-react';
import { SPEEDS, useStore } from '../../store';
import styles from './SpeedControl.module.css';

export const SpeedControl: React.FC = () => {
  const { speedIndex, paused, stepSpeed, togglePause } = useStore();

  const currentSpeed = SPEEDS[speedIndex];
  const speedText = paused
    ? 'Paused'
    : `${currentSpeed}${currentSpeed === 1 ? ' day/s' : ' days/s'}`;

  return (
    <div className={styles.speed}>
      <button
        type="button"
        className={styles.button}
        aria-label="Slower"
        onClick={() => stepSpeed(-1)}
      >
        <ChevronsLeft size={16} />
      </button>

      <button
        type="button"
        className={styles.button}
        aria-label={paused ? 'Play' : 'Pause'}
        onClick={togglePause}
      >
        {paused ? <Play size={15} /> : <Pause size={15} />}
      </button>

      <span className={styles.label}>{speedText}</span>

      <button
        type="button"
        className={styles.button}
        aria-label="Faster"
        onClick={() => stepSpeed(1)}
      >
        <ChevronsRight size={16} />
      </button>
    </div>
  );
};
