import { cssRaw, cssRule, media } from 'typestyle';

// Set css variables
export function createVariables() {
  createVariable('--background', '#0e131a');
  createVariable('--primary', '#c5c5c5');
  createVariable('--secondary', '#24262e');
  createVariable('--header', '#3d4451');
  createVariable('--error', '#dd3517');
  createVariable('--maxWidth', '950px');
}

function createVariable(name, value) {
  document.documentElement.style.setProperty(name, value);
}

// Set up css styles
export function createStyles() {
  base();
  buttons();
  inputs();
  icons();
  scrollbars();
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
    padding: '0.5rem 1.5rem',

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

function scrollbars() {
  cssRaw(`
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
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
