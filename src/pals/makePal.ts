import { Vector2 } from "@/lib/geom/Vector2";
import Entity from "@/lib/scene/Entity";
import { generateRandomPalConfig } from "@/pals/PalConfig";
import { PalAbsoluteController, PalTargetController } from "@/pals/PalController";
import PalGeom from "@/pals/PalGeom";
import PalRenderer from "@/pals/PalRenderer";
import PalWalkAnimationController from "@/pals/PalWalkAnimationController";

export function makeTargetPal(position: Vector2): Entity {
    const pal = new Entity();
    pal.addComponent(PalTargetController, position);
    const config = generateRandomPalConfig();
    const geom = pal.addComponent(PalGeom, config);
    geom.setAnimationController(new PalWalkAnimationController(config));
    pal.addComponent(PalRenderer, config);
    return pal;
}

export function makeAbsolutePal(position: Vector2): Entity {
    const pal = new Entity();
    pal.addComponent(PalAbsoluteController, position);
    const config = generateRandomPalConfig();
    const geom = pal.addComponent(PalGeom, config);
    geom.setAnimationController(new PalWalkAnimationController(config));
    pal.addComponent(PalRenderer, config);
    return pal;
}
