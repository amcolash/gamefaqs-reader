import React from 'react';
import { createRoot } from 'react-dom/client';
import { cssRule } from 'typestyle';

import { App } from './App';

import { loadServiceWorker } from './util';

// Set css variables
const variables = {
  '--background': '#0e131a',
  '--primary': '#c5c5c5',
  '--secondary': '#24262e',
  '--header': '#3d4451',
  '--maxWidth': '950px',
};

Object.entries(variables).forEach((v) => document.body.style.setProperty(v[0], v[1]));

// Load service worker for production only
if (import.meta.env.PROD) loadServiceWorker();

// Set up core styles
cssRule('html', {
  scrollPaddingTop: '7rem',
});

cssRule('body', {
  margin: 0,
  fontFamily: "'Motiva Sans', sans-serif",
  background: 'var(--background)',
  color: 'var(--primary)',
});

cssRule('button', {
  fontSize: '1.25rem',
  fontFamily: "'Motiva Sans', sans-serif",
  color: 'var(--primary)',
  background: 'var(--secondary)',
  border: 'none',
  padding: '0 1.5rem',
  height: '2.5rem',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  $nest: {
    '&:active': {
      background: 'var(--primary)',
      color: 'var(--secondary)',
    },
    '&:focus': {
      background: 'var(--primary)',
      color: 'var(--secondary)',
    },
    '&:hover': {
      background: 'var(--primary)',
      color: 'var(--secondary)',
    },
  },
});

cssRule('input', {
  fontSize: '1.25rem',
  fontFamily: "'Motiva Sans', sans-serif",
  background: 'var(--secondary)',
  border: 'none',
  color: 'var(--primary)',
  padding: '0 1.5rem',
  height: '2.5rem',

  $nest: {
    '&:focus': {
      background: 'var(--primary)',
      color: 'var(--secondary)',
    },
    '&:hover': {
      background: 'var(--primary)',
      color: 'var(--secondary)',
    },
  },
});

cssRule('#root', {
  display: 'flex',
  justifyContent: 'center',
});

cssRule('.icon', {
  width: 20,
  height: 20,
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
