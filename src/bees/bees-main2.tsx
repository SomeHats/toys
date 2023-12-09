import { AnimatedSpriteStack } from "@/bees/AnimatedSpriteStack";
import { assets } from "@/bees/assets/assets";
import { BG_COLOR } from "@/bees/constants";
import { driver } from "@/bees/driver";
import { Vector2 } from "@/lib/geom/Vector2";
import { random, times } from "@/lib/utils";
import {
    Application,
    InteractionManager,
    Renderer,
    SCALE_MODES,
    settings,
} from "pixi.js";

Renderer.registerPlugin("interaction", InteractionManager);
console.log({ Renderer, InteractionManager });

settings.STRICT_TEXTURE_CACHE = true;
settings.SCALE_MODE = SCALE_MODES.NEAREST;

const application = new Application({
    resizeTo: window,
    autoDensity: true,
    resolution: window.devicePixelRatio,
    backgroundColor: BG_COLOR,
});

document.body.appendChild(application.view);

void assets.loadAll().then(() => {
    times(20, makeBee);
});

function makeBee() {
    const sp = random(1, 5);
    const rsp = random(0.01, 0.15);

    const bee = new AnimatedSpriteStack(assets.get("beeFly"), driver);
    application.stage.addChild(bee);
    bee.x = Math.random() * 1000;
    bee.y = Math.random() * 1000;

    driver.addFixedUpdate({
        on() {},
        fixedUpdateTick() {
            const beePosition = Vector2.from(bee.getGlobalPosition());
            const mousePosition = Vector2.from(
                (
                    application.renderer.plugins
                        .interaction as InteractionManager
                ).mouse.getLocalPosition(application.stage),
            );

            const headingVec = Vector2.fromPolar(bee.heading, 1);
            const targetVec = mousePosition.sub(beePosition).normalize();
            const newVec = headingVec.lerp(targetVec, rsp);

            bee.heading = newVec.angle();
            bee.position.copyFrom(
                Vector2.from(bee.position).add(
                    Vector2.fromPolar(bee.heading, sp),
                ),
            );
        },
    });
}
