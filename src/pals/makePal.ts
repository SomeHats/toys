import Entity from "../lib/scene/Entity";
import { PalTargetController, PalAbsoluteController } from "./PalController";
import Vector2 from "../lib/geom/Vector2";
import { generateRandomPalConfig } from "./PalConfig";
import PalGeom from "./PalGeom";
import PalWalkAnimationController from "./PalWalkAnimationController";
import PalRenderer from "./PalRenderer";

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
