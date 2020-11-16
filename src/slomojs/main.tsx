import 'regenerator-runtime/runtime';
// import * as slomo from './Cargo.toml';

import('./Cargo.toml').then((slomo) => {
  const source = `
  let x = 1 + 2 + 3, a = 1, b = 2;
  let y = "hello" + x;
  console.log(y);
  `.trim();
  slomo.start(source, document.getElementById('root')!);
});
