import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import styles from './Layout.module.css';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isHub = location.pathname === '/';

  return (
    <div className={styles.container}>
      {!isHub && (
        <Link to="/" className={styles.navHome} title="Return to Celestial Hub">
          <Compass size={14} />
          <span>Hub</span>
        </Link>
      )}
      <Outlet />
    </div>
  );
};
