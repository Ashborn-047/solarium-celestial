import React from 'react';
import styles from './Chip.module.css';

export interface ChipProps {
  label: string;
  active?: boolean;
  small?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  small = false,
  onClick,
  className,
}) => {
  const classes = [
    styles.chip,
    active ? styles.active : '',
    small ? styles.small : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" className={classes} onClick={onClick}>
      {label}
    </button>
  );
};
