import autoAnimate from '@formkit/auto-animate';
import React, { useEffect, useRef, useState } from 'react';

import { Keyboard } from './Keyboard';

export function Input(props) {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef();
  const divRef = useRef();
  const keyboardRef = useRef();

  useEffect(() => {
    if (divRef.current) {
      autoAnimate(divRef.current);
    }
  }, [divRef]);

  // Show / Hide keyboard on input focusing
  useEffect(() => {
    const onFocusChange = (e) => {
      const focused = divRef?.current?.matches(':focus-within');
      setShowKeyboard(focused);
    };

    const onKeyDown = (e) => {
      if (keyboardRef && showKeyboard) {
        switch (e.key) {
          case 'ArrowUp':
            keyboardRef.current?.modules.keyNavigation.up();
            e.preventDefault();
            break;
          case 'ArrowDown':
            keyboardRef.current?.modules.keyNavigation.down();
            e.preventDefault();
            break;
          case 'ArrowLeft':
            keyboardRef.current?.modules.keyNavigation.left();
            e.preventDefault();
            break;
          case 'ArrowRight':
            keyboardRef.current?.modules.keyNavigation.right();
            e.preventDefault();
            break;
          case 'Enter':
            keyboardRef.current?.modules.keyNavigation.press();
            e.preventDefault();
            break;
          case 'Escape':
            setShowKeyboard(false);
            e.preventDefault();
            break;
          default:
            break;
        }
      }
    };

    const onEnter = (e) => {
      if (e.key === 'Enter' && !showKeyboard) {
        setShowKeyboard(true);
        e.stopPropagation();
      }
    };

    document.addEventListener('focusin', onFocusChange);
    document.addEventListener('focusout', onFocusChange);
    document.addEventListener('keydown', onKeyDown);

    inputRef.current?.addEventListener('keydown', onEnter);

    return () => {
      document.removeEventListener('focusin', onFocusChange);
      document.removeEventListener('focusout', onFocusChange);
      document.removeEventListener('keydown', onKeyDown);

      inputRef.current?.removeEventListener('keydown', onEnter);
    };
  }, [showKeyboard]);

  return (
    <div ref={divRef} style={{ width: '100%' }}>
      <input
        {...props}
        style={{ width: '100%', ...props.style }}
        ref={inputRef}
        onChange={(e) => {
          props.onChange(e);
          keyboardRef?.current?.setInput(e.target.value);
        }}
      />
      {showKeyboard && window.innerWidth <= 1280 && (
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
