import Entity from "@/lib/scene/Entity";
import { PalTargetController, PalAbsoluteController } from "@/pals/PalController";
import { Vector2 } from "@/lib/geom/Vector2";
import { generateRandomPalConfig } from "@/pals/PalConfig";
import PalGeom from "@/pals/PalGeom";
import PalWalkAnimationController from "@/pals/PalWalkAnimationController";
import PalRenderer from "@/pals/PalRenderer";

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
