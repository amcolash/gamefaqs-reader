import { useState, useEffect } from 'react';

export function useInFocus() {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    window.electronAPI.onFocusChange((_event, value) => {
      setIsFocused(value);
    });
  }, []);

  return isFocused;
}
