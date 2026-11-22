import React, { useEffect, useState } from 'react';
import styles from './Hud.module.css';

export interface HudProps {
  title?: string;
  subtitle?: string;
}

export const Hud: React.FC<HudProps> = ({
  title = 'Gargantua',
  subtitle = 'Drag to orbit. Scroll or pinch to move closer.',
}) => {
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={styles.vig} />
      <div className={styles.hud}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={`${styles.fade} ${faded ? styles.fadedOut : ''}`} />
    </>
  );
};
