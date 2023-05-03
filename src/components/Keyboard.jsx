import React from 'react';
import Keys from 'react-simple-keyboard';
import keyNavigation from 'simple-keyboard-key-navigation';
import 'react-simple-keyboard/build/css/index.css';
import { cssRaw } from 'typestyle';

import Backspace from '../icons/backspace.svg?raw';
import KeyboardIcon from '../icons/keyboard.svg?raw';

cssRaw(`
.simple-keyboard {
  max-width: min(90vw, var(--maxWidth));
}

.simple-keyboard.myTheme1 {
  background-color: transparent;
  border-radius: 0;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}

.simple-keyboard.myTheme1 .hg-button {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--secondary);
  color: var(--primary);
  border: none;
}

.simple-keyboard.myTheme1 .hg-button:active, .simple-keyboard.myTheme1 .hg-button:hover {
  background: var(--primary);
  color: var(--secondary);
}

.simple-keyboard.myTheme1 .hg-button-bksp:active, .simple-keyboard.myTheme1 .hg-button-bksp:hover {
  background: var(--error);
  color: var(--primary);
}

.simple-keyboard.myTheme1 .hg-button-close {
  max-width: 5rem;
}
`);

export function Keyboard(props) {
  return (
    <div
      className="keyboard"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 1,
        width: 'calc(100% - 2rem)',
        display: 'flex',
        justifyContent: 'center',
        background: 'var(--background)',
        padding: '1rem',
        borderTop: '3px solid var(--secondary)',
      }}
    >
      <Keys
        keyboardRef={props.keyboardRef}
        onChange={(input) => props.onChange(input)}
        onKeyPress={(button) => {
          if (button === '{close}') setTimeout(() => props.setVisible(false));
        }}
        useButtonTag={true}
        physicalKeyboardHighlight={true}
        theme="hg-theme-default myTheme1"
        layout={{
          default: ['1 2 3 4 5 6 7 8 9 0 {bksp}', 'q w e r t y u i o p', 'a s d f g h j k l', 'z x c v b n m', '{space} {close}'],
        }}
        display={{
          '{space}': ' ',
          '{bksp}': Backspace,
          '{close}': KeyboardIcon,
        }}
        enableKeyNavigation={true}
        modules={[keyNavigation]}
      />
    </div>
  );
}
