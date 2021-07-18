import { useEffect } from 'react';

export function useKeyPress(key: string, cb: (event: KeyboardEvent) => void) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      console.log({ ek: event.key, key, eq: key === event.key });
      if (event.key === key) {
        cb(event);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [key, cb]);
}
