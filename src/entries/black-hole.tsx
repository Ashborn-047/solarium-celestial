import React from 'react';
import ReactDOM from 'react-dom/client';
import BlackHoleExperience from '../experiences/black-hole';
import '../shared/styles/tokens.css';
import '../shared/styles/base.css';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <BlackHoleExperience />
    </React.StrictMode>
  );
}
