import { AssetBundle } from '../AssetBundle';
import { Sprite } from '../Sprite';
import { SpriteStack } from '../SpriteStack';

export const assets = new AssetBundle({
  beeFlyingSpriteStack: () =>
    SpriteStack.load({
      geometry: import('./bee-outline.json'),
      url: import('./bee-outline.png'),
      scale: 2,
      frameRate: 12,
      originX: 0.5,
      originY: 0.7,
      angleOffset: 0.5,
    }),
  smallShadow: () =>
    Sprite.load({
      url: import('./bee-shadow.png'),
      scale: 2,
      originX: 0.5,
      originY: 0.5,
    }),
});
