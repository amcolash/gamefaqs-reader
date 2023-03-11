import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './components/App';
import { getCookie } from './utils/cookie';
import { createStyles, createVariables } from './utils/styles';

// Set up core styles
createVariables();
createStyles();

// Get gamefaqs cookie before rendering
getCookie().then((cookie) => {
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
