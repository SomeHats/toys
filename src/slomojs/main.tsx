import 'regenerator-runtime/runtime';
// import * as slomo from './Cargo.toml';

import('./Cargo.toml').then((slomo) => {
  const source = `
  let x = 1 + 2 + 3, a = 1, b = 2;
  let y = "hello" + x;
  log(y, x, a, b, log);
  __debugScope();
  log(__debugScope);
  `.trim();
  slomo
    .start(source, document.getElementById('root')!)
    .then((result) => console.log('success', result))
    .catch((err) => console.log('error', err));
});
