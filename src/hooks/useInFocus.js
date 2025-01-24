import { useEffect, useState } from 'react';

export function useInFocus() {
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    window.electronAPI.onFocusChange((_event, value) => {
      setIsFocused(value);
    });
  }, []);

  return isFocused;
}
