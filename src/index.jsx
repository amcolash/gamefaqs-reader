import React from 'react';
import { createRoot } from 'react-dom/client';
import 'joypad.js';

import { App } from './components/App';

import { createStyles, createVariables } from './utils/styles';

window.joypad.set({
  axisMovementThreshold: 0.05,
});

async function init() {
  // Set up core styles
  createVariables();
  createStyles();

  // Get gamefaqs cookie before rendering
  await window.electronAPI.cookie();

  // Render the application once loaded
  createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
    // </React.StrictMode>
    <App />
  );
}

init();
