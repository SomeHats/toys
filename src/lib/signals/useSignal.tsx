import { Signal } from './Signals';
import { useSubscription } from 'use-subscription';
import { useMemo } from 'react';

export default function useSignal(signal: Signal): number {
  return useSubscription(
    useMemo(
      () => ({
        getCurrentValue: () => signal.read(),
        subscribe: (cb) => signal.manager.onUpdate(cb),
      }),
      [signal],
    ),
  );
}
