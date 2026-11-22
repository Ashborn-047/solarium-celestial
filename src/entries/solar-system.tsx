import React from 'react';
import ReactDOM from 'react-dom/client';
import SolarSystemExperience from '../experiences/solar-system';
import '../shared/styles/tokens.css';
import '../shared/styles/base.css';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <SolarSystemExperience />
    </React.StrictMode>
  );
}
