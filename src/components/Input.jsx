import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { throttle, updateInputValue } from '../utils/util';

import { Keyboard } from './Keyboard';
import { deviceTypes, useDeviceType } from '../hooks/useDeviceType';
import { useInFocus } from '../hooks/useInFocus';

export function Input(props) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef();
  const keyboardRef = useRef();
  const type = useDeviceType();
  const focus = useInFocus();

  const [animationParent] = useAutoAnimate();
  const keyboardEnabled = type === deviceTypes.deck;

  const moveMarkerVertical = useCallback(
    (dir) => {
      const pos = keyboardRef.current?.modules.keyNavigation.markerPosition;
      const rows = document.querySelectorAll('.keyboard .hg-row');

      const curButton = rows[pos.row].querySelectorAll('.hg-button')[pos.button];
      const middle = curButton.getBoundingClientRect().x + curButton.getBoundingClientRect().width / 2;

      const newRow = dir > 0 ? Math.min(pos.row + 1, rows.length - 1) : Math.max(0, pos.row - 1);
      const nextButtons = Array.from(rows[newRow].querySelectorAll('.hg-button'));

      let button = -1;
      let dist = 99999;
      nextButtons.forEach((b, i) => {
        const bLeftDist = Math.abs(middle - b.getBoundingClientRect().x);
        const bRightDist = Math.abs(middle - (b.getBoundingClientRect().x + b.getBoundingClientRect().width));

        const bDist = Math.min(bLeftDist, bRightDist);
        if (bDist < dist) {
          dist = bDist;
          button = i;
        }
      });

      if (button >= 0) keyboardRef.current?.modules.keyNavigation.setMarker(newRow, button);
    },
    [keyboardRef]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!focus) return;

      if (showKeyboard && keyboardEnabled) {
        let handled = true;

        switch (e.key) {
          case 'ArrowUp':
            moveMarkerVertical(-1);
            break;
          case 'ArrowDown':
            moveMarkerVertical(1);
            break;
          case 'ArrowLeft':
            keyboardRef.current?.modules.keyNavigation.left();
            break;
          case 'ArrowRight':
            keyboardRef.current?.modules.keyNavigation.right();
            break;
          case 'Enter':
            keyboardRef.current?.modules.keyNavigation.press();
            break;
          case 'Escape':
            setShowKeyboard(false);
            break;
          default:
            handled = false;

            // This small hack allows for typing on steam deck via native keyboards
            if (props.updateValue) {
              const ascii = e.key.length === 1 ? e.key.charCodeAt(0) : -1;
              if (ascii >= 32 && ascii <= 126) props.updateValue(inputRef.current?.value + e.key);
            }

            break;
        }

        if (handled) {
          e.preventDefault();
          e.stopPropagation();
        }
      } else if (document.activeElement === inputRef.current) {
        if (e.key === 'Enter') setShowKeyboard(true);
        if (e.key === 'Escape' && inputRef.current?.value.length > 0) {
          setTimeout(() => {
            updateInputValue(inputRef.current, '');
            inputRef.current?.setSelectionRange(0, 0);
            keyboardRef.current?.setCaretPosition(0);
          });
        }
      }
    },
    [showKeyboard, keyboardEnabled, keyboardRef, inputRef]
  );

  const throttledAxisKeyDown = useCallback(
    throttle((e) => handleKeyDown(e), 250),
    [handleKeyDown]
  );

  const onLeft = useCallback(() => {
    const input = inputRef.current;
    const prev = Math.max(0, input.selectionStart - 1);
    input.setSelectionRange(prev, prev);
    keyboardRef.current?.setCaretPosition(prev, prev);
  }, [inputRef, keyboardRef]);

  const onRight = useCallback(() => {
    const input = inputRef.current;
    const next = Math.min(input.value.length, input?.selectionStart + 1);
    input.setSelectionRange(next, next);
    keyboardRef.current?.setCaretPosition(next, next);
  }, [inputRef, keyboardRef]);

  useEffect(() => {
    const buttonListener = window.joypad.on('button_press', (e) => {
      if (!focus) return;

      const button = e.detail.index;
      const input = inputRef.current;

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
          onLeft();
          break;
        case 5: // R1 - Cursor Right
          onRight();
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

    const axisListener = window.joypad.on('axis_move', (e) => {
      if (!focus) return;

      // Left stick, horizontal axis
      if (e.detail.axis === 0 && Math.abs(e.detail.axisMovementValue) > 0.2) {
        throttledAxisKeyDown({
          key: e.detail.axisMovementValue > 0 ? 'ArrowRight' : 'ArrowLeft',
          preventDefault: () => {},
          stopPropagation: () => {},
        });
      }

      // Left stick, vertical axis
      if (e.detail.axis === 1 && Math.abs(e.detail.axisMovementValue) > 0.2) {
        throttledAxisKeyDown({
          key: e.detail.axisMovementValue > 0 ? 'ArrowDown' : 'ArrowUp',
          preventDefault: () => {},
          stopPropagation: () => {},
        });
      }
    });

    return () => {
      buttonListener.unsubscribe();
      axisListener.unsubscribe();
    };
  }, [handleKeyDown, keyboardRef, inputRef]);

  const { updateValue, ...updatedProps } = props;

  return (
    <div ref={animationParent} style={{ width: '100%' }}>
      <input
        {...updatedProps}
        style={props.style}
        ref={inputRef}
        onChange={(e) => {
          props.onChange(e);
          keyboardRef.current?.setInput(e.target.value);
        }}
        readOnly={keyboardEnabled}
        onFocus={(e) => setShowKeyboard(true)}
        onBlur={(e) => {
          // If a key is clicked, don't hide the keyboard
          if (keyboardRef.current?.keyboardDOM.contains(e.relatedTarget)) {
            // Remove key highlight when keys are clicked
            const module = keyboardRef.current?.modules.keyNavigation;
            if (module.markedBtn) module.markedBtn.classList.remove('hg-keyMarker');

            return;
          }

          // Otherwise, hide the keyboard on blur
          setShowKeyboard(false);
        }}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      {keyboardEnabled && showKeyboard && (
        <Keyboard
          onLeft={onLeft}
          onRight={onRight}
          keyboardRef={(ref) => {
            keyboardRef.current = ref;
            keyboardRef.current?.setInput(props.value);
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
