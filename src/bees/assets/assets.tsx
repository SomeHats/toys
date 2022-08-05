import { AnimatedSpriteStackSheet } from "../AnimatedSpriteStackSheet";
import { AssetBundle } from "../AssetBundle";
import { Sprite } from "../Sprite";
import { SpriteStack } from "../SpriteStack";

export const assets = new AssetBundle()
    .add("beeOutlineBaseTexture", () =>
        AssetBundle.loadBaseTexture(new URL("./bee-outline.png", import.meta.url)),
    )
    .add("beeOutlined", (dependency) =>
        AnimatedSpriteStackSheet.load({
            geometry: new URL("raw:./bee-outline.json", import.meta.url),
            baseTexture: dependency("beeOutlineBaseTexture"),
            resolution: 0.3,
            framesPerSecond: 12,
            originX: 0.5,
            originY: 0.7,
            angleOffset: 0.5,
        }),
    )
    .add("beeFlyBaseTexture", () =>
        AssetBundle.loadBaseTexture(new URL("./bee-fly.png", import.meta.url)),
    )
    .add("beeFly", (dependency) =>
        AnimatedSpriteStackSheet.load({
            geometry: new URL("raw:./bee-fly.json", import.meta.url),
            baseTexture: dependency("beeFlyBaseTexture"),
            resolution: 0.3,
            framesPerSecond: 12,
            originX: 0.5,
            originY: 0.7,
            angleOffset: 0.5,
        }),
    )
    .add("beeFlatBaseTexture", () =>
        AssetBundle.loadBaseTexture(new URL("./bee-flat.png", import.meta.url)),
    )
    .add("beeFlat", (dependency) =>
        AnimatedSpriteStackSheet.load({
            geometry: new URL("raw:./bee-flat.json", import.meta.url),
            baseTexture: dependency("beeFlatBaseTexture"),
            resolution: 0.3,
            framesPerSecond: 12,
            originX: 0.5,
            originY: 0.7,
            angleOffset: 0.5,
        }),
    );

// export const assets = new AssetBundle({
//   beeOutlineBaseTexture: ,
//   beeOutlined: (dep) =>
//     AnimatedSpriteStackSheet.load({
//       geometry: import('./bee-outline.json'),
//       baseTexture: dep('beeOutlineBaseTexture'),
//       resolution: 0.5,
//       framesPerSecond: 12,
//       originX: 0.5,
//       originY: 0.7,
//       angleOffset: 0.5,
//     }),
//   // beeFlyingSpriteStack: () =>
//   //   SpriteStack.load({
//   //     geometry: import('./bee-outline.json'),
//   //     url: import('./bee-outline.png'),
//   //     scale: 2,
//   //     frameRate: 12,
//   //     originX: 0.5,
//   //     originY: 0.7,
//   //     angleOffset: 0.5,
//   //   }),
//   // smallShadow: () =>
//   //   Sprite.load({
//   //     url: import('./bee-shadow.png'),
//   //     scale: 2,
//   //     originX: 0.5,
//   //     originY: 0.5,
//   //   }),
// });
