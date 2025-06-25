import { cssRaw, cssRule, media } from 'typestyle';

import { deckSize } from './util';

// Set css variables
export function createVariables() {
  createVariable('--background', '#0e131a');
  createVariable('--primary', '#f5f5f5');
  createVariable('--secondary', '#24262e');
  createVariable('--dark', '#0d141c');
  createVariable('--header', '#3d4451');
  createVariable('--error', '#dd3517');
  createVariable('--maxWidth', window.innerWidth > deckSize ? '1280px' : '950px');
  createVariable('--steamBlue', '#1a9ffe');
  createVariable('--table', '#3d4451');
}

function createVariable(name, value) {
  document.documentElement.style.setProperty(name, value);
}

// Set up css styles
export function createStyles() {
  base();
  buttons();
  inputs();
  select();
  icons();
  scrollbars();
}

function base() {
  cssRule(
    'html',
    {
      scrollPaddingTop: '7rem',
      overflowX: 'hidden',
      userSelect: 'none',
    },
    // Larger UI for steam deck
    media(
      { maxWidth: deckSize },
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

const buttonStyle = {
  fontSize: '1.25rem',
  fontFamily: "'Motiva Sans', sans-serif",
  color: 'var(--primary)',
  background: 'var(--secondary)',
  outline: 'none',
  border: 'none',
  borderRadius: 3,
  padding: '0.5rem 1.5rem',

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  $nest: {
    '&:active:not([disabled]), &:focus:not([disabled]), &:hover:not([disabled])': {
      background: 'var(--primary)',
      color: 'var(--secondary)',
    },
    '&.blue:active:not([disabled]), &.blue:focus:not([disabled]), &.blue:hover:not([disabled])': {
      background: 'var(--steamBlue)',
      color: 'var(--primary)',
    },

    '&:disabled': {
      opacity: 0.5,
    },
  },
};

function buttons() {
  cssRule('button', buttonStyle);

  cssRule('button.error', {
    $nest: {
      '&:active, &:focus, &:hover': {
        background: 'var(--error)',
        color: 'var(--primary)',
      },
    },
  });

  cssRule('.glyph', {
    width: 24,
    height: 24,
  });
}

function select() {
  cssRule('select', {
    ...buttonStyle,

    // add right side padding to arrow
    paddingRight: '0',
    borderRight: '1.5rem solid transparent',
  });
}

function inputs() {
  cssRule('input', {
    fontSize: '1.25rem',
    fontFamily: "'Motiva Sans', sans-serif",
    background: 'var(--secondary)',
    border: 'none',
    color: 'var(--primary)',
    outline: 'none',
    width: '100%',
    height: '2.5rem',
    padding: '0 1.5rem',
    boxSizing: 'border-box',

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
    background: `url(./x-circle-fill.svg) no-repeat 50% 50%`,
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

function scrollbars() {
  cssRaw(`
::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}
::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
::-webkit-scrollbar-thumb {
  background: var(--header);
}
::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}
::-webkit-scrollbar-track {
  background: var(--secondary);
}
::-webkit-scrollbar-corner {
  background: transparent;
}`);
}
