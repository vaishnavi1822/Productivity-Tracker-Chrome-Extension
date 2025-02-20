import { useEffect } from 'react';

export const useKeyboardShortcut = (key, callback, deps = []) => {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === key) {
        callback();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, ...deps]);
}; 