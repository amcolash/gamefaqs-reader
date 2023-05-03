import { useCallback } from 'react';

// From https://blog.logrocket.com/how-to-autofocus-using-react-hooks/
export function useAutoFocus() {
  const inputRef = useCallback((inputElement) => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return inputRef;
}
