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

    document.addEventListener('focusin', onFocusChange);
    document.addEventListener('focusout', onFocusChange);

    return () => {
      document.removeEventListener('focusin', onFocusChange);
      document.removeEventListener('focusout', onFocusChange);
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
            console.log('onChange', text);
            props.onChange({ target: { value: text } });
          }}
          setVisible={(visible) => setShowKeyboard(visible)}
        />
      )}
    </div>
  );
}
