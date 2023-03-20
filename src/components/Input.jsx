import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Keyboard } from './Keyboard';

export function Input(props) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef();
  const keyboardRef = useRef();

  const [animationParent] = useAutoAnimate();
  const keyboardEnabled = window.innerWidth <= 1280;

  const handleKeyDown = useCallback(
    (e) => {
      let handled = false;
      if (showKeyboard && keyboardEnabled) {
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

        if (handled) {
          e.preventDefault();
          e.stopPropagation();
        }
      } else {
        if (e.key === 'Enter') setShowKeyboard(true);
      }
    },
    [showKeyboard, keyboardEnabled, keyboardRef]
  );

  useEffect(() => {
    const listener = window.joypad.on('button_press', (e) => {
      if (e.detail.gamepad.index !== 0) return;
      const button = e.detail.index;

      // console.log(button);

      switch (button) {
        case 0: // A (B nintendo)
          handleKeyDown({ key: 'Enter', preventDefault: () => {}, stopPropagation: () => {} });
          break;
        case 1: // B (A nintendo)
          handleKeyDown({ key: 'Escape', preventDefault: () => {}, stopPropagation: () => {} });
          break;
        case 2: // X (Y nintendo)
          // inputRef.current?.value = inputRef.current?.value.sub;
          break;
        case 4: // L1
          const prev = Math.max(0, keyboardRef.current?.getCaretPosition() - 1);
          keyboardRef.current?.setCaretPosition(prev);
          inputRef.current?.setSelectionRange(prev, prev);
          break;
        case 5: // R1
          const next = Math.min(keyboardRef.current?.getInput().length, keyboardRef.current?.getCaretPosition() + 1);
          console.log(keyboardRef.current?.getInput().length, keyboardRef.current?.getCaretPosition() + 1);
          keyboardRef.current?.setCaretPosition(next);
          inputRef.current?.setSelectionRange(next, next);
          break;
        case 12: // Dpad Up
          handleKeyDown({ key: 'ArrowUp', preventDefault: () => {}, stopPropagation: () => {} });
          break;
        case 13: // Dpad Down
          handleKeyDown({ key: 'ArrowDown', preventDefault: () => {}, stopPropagation: () => {} });
          break;
        case 14: // Dpad Left
          handleKeyDown({ key: 'ArrowLeft', preventDefault: () => {}, stopPropagation: () => {} });
          break;
        case 15: // Dpad Right
          handleKeyDown({ key: 'ArrowRight', preventDefault: () => {}, stopPropagation: () => {} });
          break;
      }
    });

    return () => {
      listener.unsubscribe();
    };
  }, [handleKeyDown, keyboardRef, inputRef]);

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
        onFocus={(e) => setShowKeyboard(true)}
        onBlur={(e) => setShowKeyboard(false)}
        onKeyDown={(e) => handleKeyDown(e)}
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
