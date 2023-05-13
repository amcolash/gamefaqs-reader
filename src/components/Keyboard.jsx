import React from 'react';
import Keys from 'react-simple-keyboard';
import keyNavigation from 'simple-keyboard-key-navigation';
import 'react-simple-keyboard/build/css/index.css';
import { cssRaw } from 'typestyle';

import Backspace from '../icons/backspace.svg?raw';
import KeyboardIcon from '../icons/keyboard.svg?raw';
import LeftIcon from '../icons/caret-left-fill.svg?raw';
import RightIcon from '../icons/caret-right-fill.svg?raw';

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

.hg-theme-default .hg-row:not(:last-child) {
  margin-bottom: 7px;
}

.hg-theme-default .hg-row .hg-button-container, .hg-theme-default .hg-row .hg-button:not(:last-child) {
  margin-right: 7px;
}

.simple-keyboard.myTheme1 .hg-button {
  height: 45px;
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

.simple-keyboard.myTheme1 .hg-button-close,
.simple-keyboard.myTheme1 .hg-button-left,
.simple-keyboard.myTheme1 .hg-button-right {
  max-width: 5rem;
}

.simple-keyboard.myTheme1 .hg-button-space span,
.simple-keyboard.myTheme1 .hg-button-bksp span,
.simple-keyboard.myTheme1 .hg-button-close span,
.simple-keyboard.myTheme1 .hg-button-left span,
.simple-keyboard.myTheme1 .hg-button-right span {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.simple-keyboard.myTheme1 .hg-button-space span {
  width: 100%;
  margin-left: 1rem;
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
        zIndex: 4,
        width: 'calc(100% - 0.7rem)',
        display: 'flex',
        justifyContent: 'center',
        background: 'var(--dark)',
        padding: '0.35rem',
      }}
    >
      <Keys
        keyboardRef={props.keyboardRef}
        onChange={(input) => props.onChange(input)}
        onKeyPress={(button) => {
          if (button === '{close}') setTimeout(() => props.setVisible(false));
          if (button === '{left}') props.onLeft();
          if (button === '{right}') props.onRight();
        }}
        useButtonTag={true}
        physicalKeyboardHighlight={true}
        theme="hg-theme-default myTheme1"
        layout={{
          default: [
            '1 2 3 4 5 6 7 8 9 0 {bksp}',
            'q w e r t y u i o p',
            'a s d f g h j k l',
            'z x c v b n m',
            '{left} {right} {space} {close}',
          ],
        }}
        display={{
          '{space}': '<img src="./gamepad/y.png" class="glyph" />',
          '{bksp}': `<img src="./gamepad/x.png" class="glyph" style="margin-right: 1rem;" /> ${Backspace}`,
          '{close}': `<img src="./gamepad/b.png" class="glyph" style="margin-right: 1rem;" /> ${KeyboardIcon}`,
          '{left}': `<img src="./gamepad/l1.png" class="glyph" style="margin-right: 1rem;" /> ${LeftIcon}`,
          '{right}': `<img src="./gamepad/r1.png" class="glyph" style="margin-right: 1rem;" /> ${RightIcon}`,
        }}
        enableKeyNavigation={true}
        modules={[keyNavigation]}
      />
    </div>
  );
}
