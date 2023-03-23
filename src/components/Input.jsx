import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { updateInputValue } from '../utils/util';

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
        if (e.key === 'Enter' && document.activeElement === inputRef.current) setShowKeyboard(true);
      }
    },
    [showKeyboard, keyboardEnabled, keyboardRef, inputRef]
  );

  useEffect(() => {
    const listener = window.joypad.on('button_press', (e) => {
      if (e.detail.gamepad.index !== 0) return;
      const button = e.detail.index;

      const input = inputRef.current;

      // console.log(button);

      switch (button) {
        case 0: // A (B nintendo) - Confirm
          handleKeyDown({ key: 'Enter', preventDefault: () => {}, stopPropagation: () => {} });
          break;
        case 1: // B (A nintendo) - Back
          handleKeyDown({ key: 'Escape', preventDefault: () => {}, stopPropagation: () => {} });
          break;
        case 2: // X (Y nintendo) - Delete
          // Position of cursor
          const last = Math.max(0, input.selectionStart - 1);

          // Remove character from input
          const newValue = input.value.slice(0, input.selectionStart - 1) + input.value.slice(input.selectionStart, input.value.length);
          updateInputValue(input, newValue);

          // Move cursor accordingly
          input.setSelectionRange(last, last);
          keyboardRef.current?.setCaretPosition(last);
          break;
        case 4: // L1 - Cursor Left
          const prev = Math.max(0, input.selectionStart - 1);
          input.setSelectionRange(prev, prev);
          keyboardRef.current?.setCaretPosition(prev);
          break;
        case 5: // R1 - Cursor Right
          const next = Math.min(input.value.length, input?.selectionStart + 1);
          input.setSelectionRange(next, next);
          keyboardRef.current?.setCaretPosition(next);
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
        // onFocus={(e) => setShowKeyboard(true)}
        // onBlur={(e) => setShowKeyboard(false)}
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
