import React from 'react';
import styles from './InfoCard.module.css';

export interface InfoCardProps {
  title: string;
  note?: string;
  facts?: [string, string][];
  footer?: string;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  note,
  facts = [],
  footer,
  className,
}) => {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      <h2 className={styles.title}>{title}</h2>
      {note && <p className={styles.note}>{note}</p>}
      {facts.length > 0 && (
        <dl className={styles.facts}>
          {facts.map(([label, value], i) => (
            <React.Fragment key={`${label}-${i}`}>
              <dt className={styles.factLabel}>{label}</dt>
              <dd className={styles.factValue}>{value}</dd>
            </React.Fragment>
          ))}
        </dl>
      )}
      {footer && <small className={styles.small}>{footer}</small>}
    </div>
  );
};
