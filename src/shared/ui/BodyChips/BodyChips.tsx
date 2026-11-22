import React from 'react';
import { Chip } from '../Chip/Chip';
import styles from './BodyChips.module.css';

export interface BodyChipItem {
  id: string;
  name: string;
}

export interface BodyChipsProps {
  items: BodyChipItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  small?: boolean;
  className?: string;
}

export const BodyChips: React.FC<BodyChipsProps> = ({
  items,
  selectedId,
  onSelect,
  small = false,
  className,
}) => {
  return (
    <div className={`${styles.row} ${className || ''}`}>
      {items.map((item) => (
        <Chip
          key={item.id}
          label={item.name}
          active={item.id === selectedId}
          small={small}
          onClick={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
};
