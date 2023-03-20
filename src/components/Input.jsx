import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useEffect, useRef, useState } from 'react';

import { Keyboard } from './Keyboard';

export function Input(props) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef();
  const divRef = useRef();
  const keyboardRef = useRef();

  const [animationParent] = useAutoAnimate();

  const keyboardEnabled = window.innerWidth <= 1280;

  return (
    <div ref={animationParent} style={{ width: '100%' }}>
      <input
        {...props}
        style={{ width: '100%', ...props.style }}
        ref={inputRef}
        onChange={(e) => {
          props.onChange(e);
          keyboardRef?.current?.setInput(e.target.value);
        }}
        onFocus={(e) => {
          setShowKeyboard(true);
        }}
        onBlur={(e) => {
          setShowKeyboard(false);
        }}
        onKeyDown={(e) => {
          if (!keyboardEnabled) return;

          let handled = false;
          if (showKeyboard) {
            switch (e.key) {
              case 'ArrowUp':
                keyboardRef.current?.modules.keyNavigation.up();
                handled = true;
                break;
              case 'ArrowDown':
                keyboardRef.current?.modules.keyNavigation.down();
                handled = true;
                break;
              case 'ArrowLeft':
                keyboardRef.current?.modules.keyNavigation.left();
                handled = true;
                break;
              case 'ArrowRight':
                keyboardRef.current?.modules.keyNavigation.right();
                handled = true;
                break;
              case 'Enter':
                keyboardRef.current?.modules.keyNavigation.press();
                handled = true;
                break;
              case 'Escape':
                setShowKeyboard(false);
                handled = true;
                break;
              default:
                break;
            }

            if (handled) e.preventDefault();
          } else {
            if (e.key === 'Enter') setShowKeyboard(true);
          }
        }}
      />
      {showKeyboard && keyboardEnabled && (
        <Keyboard
          keyboardRef={(ref) => {
            keyboardRef.current = ref;
            keyboardRef.current.setInput(props.value);
          }}
          onChange={(text) => {
            props.onChange({ target: { value: text } });
          }}
          setVisible={(visible) => setShowKeyboard(visible)}
        />
      )}
    </div>
  );
}
