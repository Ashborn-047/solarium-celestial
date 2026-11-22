import React from 'react';
import { Link } from 'react-router-dom';
import { Orbit, Globe2, CircleDot, Flame, ArrowRight } from 'lucide-react';
import styles from './HubPage.module.css';

interface HubCardItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  tag: string;
}

const CARDS: HubCardItem[] = [
  {
    title: 'Solar System',
    description:
      'The entire solar system in motion: Sun, 8 planets, Pluto, 24 moons, and the asteroid belt at real orbital periods.',
    href: '/solar-system',
    icon: <Orbit size={22} />,
    tag: 'Explore System',
  },
  {
    title: 'Solar bodies',
    description:
      'Single-body inspector with high-fidelity texture maps, Earth atmospheric scattering, night city lights, and ring shadows.',
    href: '/bodies',
    icon: <Globe2 size={22} />,
    tag: 'Inspect Bodies',
  },
  {
    title: 'Gargantua',
    description:
      'A relativistic raymarched Schwarzschild black hole with curved null geodesics, gravitational lensing, and Doppler boosting.',
    href: '/black-hole',
    icon: <CircleDot size={22} />,
    tag: 'View Black Hole',
  },
  {
    title: 'Collapse the Sun',
    description:
      'Witness the Sun undergoing gravitational collapse into a black hole with relativistic accretion disk and lensed background.',
    href: '/solar-system?collapse=1',
    icon: <Flame size={22} />,
    tag: 'Trigger Collapse',
  },
];

export const HubPage: React.FC = () => {
  return (
    <div className={styles.hub}>
      <header className={styles.header}>
        <h1 className={styles.title}>Celestial System</h1>
        <p className={styles.subtitle}>Modular Three.js astrophysics and planetary mechanics</p>
      </header>

      <main className={styles.grid}>
        {CARDS.map((card) => (
          <Link key={card.title} to={card.href} className={styles.card}>
            <div className={styles.iconWrapper}>{card.icon}</div>
            <h2 className={styles.cardTitle}>{card.title}</h2>
            <p className={styles.cardDescription}>{card.description}</p>
            <div className={styles.cardFooter}>
              <span>{card.tag}</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
};

export default HubPage;
