import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { createStyles, createVariables } from './utils/styles';

// Set up core styles
createVariables();
createStyles();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
