import React from 'react';
import styles from './Loader.module.css';

export interface LoaderProps {
  message?: string;
  visible?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  message = 'Building worlds',
  visible = true,
}) => {
  return (
    <div className={`${styles.loader} ${visible ? '' : styles.hidden}`}>
      <span>{message}</span>
    </div>
  );
};
