import React from 'react';
import { Link } from 'react-router-dom';
import { Orbit, Globe2, CircleDot, Flame, ArrowRight, Sparkles } from 'lucide-react';
import styles from './HubPage.module.css';
import heroStyles from './HubHero.module.css';

interface HubCardItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  tag: string;
}

const PRIMARY_CARD: HubCardItem = {
  title: 'Solar System',
  description:
    'The complete solar system featuring high-fidelity solar bodies: Sun, 8 planets, Pluto, 24 moons, and the asteroid belt in full orbital motion.',
  href: '/solar-system',
  icon: <Orbit size={28} />,
  tag: 'Launch Primary System',
};

const SECONDARY_CARDS: HubCardItem[] = [
  {
    title: 'Solar bodies',
    description:
      'Single-body inspector with detailed surface maps, Earth atmospheric scattering, night city lights, and ring shadows.',
    href: '/bodies',
    icon: <Globe2 size={20} />,
    tag: 'Inspect Bodies',
  },
  {
    title: 'Gargantua',
    description:
      'A relativistic raymarched Schwarzschild black hole with curved null geodesics, gravitational lensing, and Doppler boosting.',
    href: '/black-hole',
    icon: <CircleDot size={20} />,
    tag: 'View Black Hole',
  },
  {
    title: 'Collapse the Sun',
    description:
      'Witness the Sun undergoing gravitational collapse into a black hole with relativistic accretion disk and lensed background.',
    href: '/solar-system?collapse=1',
    icon: <Flame size={20} />,
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

      <main className={styles.content}>
        <Link to={PRIMARY_CARD.href} className={heroStyles.heroCard}>
          <div className={heroStyles.heroBadge}>
            <Sparkles size={13} />
            <span>PRIMARY SYSTEM</span>
          </div>
          <div className={heroStyles.heroBody}>
            <div className={heroStyles.heroIcon}>{PRIMARY_CARD.icon}</div>
            <div className={heroStyles.heroText}>
              <h2 className={heroStyles.heroTitle}>{PRIMARY_CARD.title}</h2>
              <p className={heroStyles.heroDesc}>{PRIMARY_CARD.description}</p>
            </div>
            <div className={heroStyles.heroAction}>
              <span>{PRIMARY_CARD.tag}</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>

        <div className={styles.sectionDivider}>
          <span>SPECIALIZED MODES & EXPLORATIONS</span>
        </div>

        <div className={styles.grid}>
          {SECONDARY_CARDS.map((card) => (
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
        </div>
      </main>
    </div>
  );
};

export default HubPage;
