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
      if (window.innerWidth <= 1280) setShowKeyboard(focused);
    };

    const onKeyDown = (e) => {
      if (keyboardRef) {
        if (e.key === 'ArrowUp') {
          keyboardRef.current?.modules.keyNavigation.up();
          e.preventDefault();
        } else if (e.key === 'ArrowDown') {
          keyboardRef.current?.modules.keyNavigation.down();
          e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
          keyboardRef.current?.modules.keyNavigation.left();
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          keyboardRef.current?.modules.keyNavigation.right();
          e.preventDefault();
        } else if (e.key === 'Enter') keyboardRef.current?.modules.keyNavigation.press();
        else if (e.key === 'Escape') {
          setShowKeyboard(false);
          e.preventDefault();
        }
      }
    };

    const onEnter = (e) => {
      if (e.key === 'Enter') {
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
  });

  return (
    <div ref={divRef} style={{ width: '100%' }}>
      <input
        {...props}
        style={{ width: '100%' }}
        ref={inputRef}
        onChange={(e) => {
          props.onChange(e);
          keyboardRef?.current?.setInput(e.target.value);
        }}
      />
      {showKeyboard && (
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
