import { cssRule, media } from 'typestyle';

// Set css variables
export function createVariables() {
  const variables = {
    '--background': '#0e131a',
    '--primary': '#c5c5c5',
    '--secondary': '#24262e',
    '--header': '#3d4451',
    '--error': '#dd3517',
    '--maxWidth': '950px',
  };

  Object.entries(variables).forEach((v) => document.body.style.setProperty(v[0], v[1]));
}

// Set up css styles
export function createStyles() {
  base();
  buttons();
  inputs();
  icons();
}

function base() {
  cssRule(
    'html',
    {
      scrollPaddingTop: '7rem',
    },
    // Larger UI for steam deck
    media(
      { maxWidth: 1280 },
      {
        zoom: 1.25,
      }
    )
  );

  cssRule('body', {
    margin: 0,
    fontFamily: "'Motiva Sans', sans-serif",
    background: 'var(--background)',
    color: 'var(--primary)',
  });

  cssRule('#root', {
    display: 'flex',
    justifyContent: 'center',
  });
}

function buttons() {
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
      '&:active:not([disabled]), &:focus:not([disabled]), &:hover:not([disabled])': {
        background: 'var(--primary)',
        color: 'var(--secondary)',
      },
      '&:disabled': {
        opacity: 0.5,
      },
    },
  });

  cssRule('button.error', {
    $nest: {
      '&:active, &:focus, &:hover': {
        background: 'var(--error)',
        color: 'var(--primary)',
      },
    },
  });
}

function inputs() {
  cssRule('input', {
    fontSize: '1.25rem',
    fontFamily: "'Motiva Sans', sans-serif",
    background: 'var(--secondary)',
    border: 'none',
    color: 'var(--primary)',
    padding: '0 1.5rem',
    height: '2.5rem',

    $nest: {
      '&:focus, &:hover': {
        background: 'var(--primary)',
        color: 'var(--secondary)',
      },
    },
  });

  cssRule('input[type="search"]::-webkit-search-cancel-button', {
    appearance: 'none',
    height: '1em',
    width: '1em',
    borderRadius: '50em',
    background: `url(./times-circle-solid.svg) no-repeat 50% 50%`,
    backgroundSize: 'contain',
    pointerEvents: 'none',
    opacity: 0,
    '-webkit-appearance': 'none',
  });

  cssRule('input[type="search"]:focus::-webkit-search-cancel-button', {
    opacity: '0.6',
    pointerEvents: 'all',
  });
}

function icons() {
  cssRule('.icon', {
    width: 20,
    height: 20,
  });
}
