import 'regenerator-runtime/runtime';
import { has } from '../lib/utils';
// import * as slomo from './Cargo.toml';

// Chrome does not seem to expose the Animation constructor globally
if (typeof Animation === 'undefined') {
  // @ts-expect-error
  window.Animation = document.body.animate({}).constructor;
}

if (!has(Animation.prototype, 'finished')) {
  console.log('add finished polyfill');
  Object.defineProperty(Animation.prototype, 'finished', {
    get() {
      if (!this._finished) {
        this._finished =
          this.playState === 'finished'
            ? Promise.resolve()
            : new Promise((resolve, reject) => {
                this.addEventListener('finish', resolve, { once: true });
                this.addEventListener('cancel', reject, { once: true });
              });
      }
      return this._finished;
    },
  });
}

import('./Cargo.toml').then((slomo) => {
  // slomo.tester(document.getElementById('root')!);

  const source = `
    let str = "hello, world";
    log(str);
    let x = 1 + 2000 + 3 + "hiii", a = 1, b = 2, c;
    let y = "hello" + x;
    log(y, x, a, b + b + a, log);
    __debugScope();
    log(__debugScope);
    `.trim();
  slomo
    .start(source, document.getElementById('root')!)
    .then((result) => console.log('success', result))
    .catch((err) => console.log('error', err));
});
