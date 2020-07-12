import { unstable_batchedUpdates } from 'react-dom';

export type Unsubscribe = () => void;

type Listener<T> = T extends undefined ? () => void : (event: T) => void;

export default class EventEmitter<T> {
  private handlers = new Set<Listener<T>>();

  listen(listener: Listener<T>) {
    const handler = ((event: T) => listener(event)) as Listener<T>;
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  emit(...args: T extends undefined ? [] : [T]) {
    unstable_batchedUpdates(() => {
      for (const handler of this.handlers) {
        handler(args[0] as T);
      }
    });
  }
}
