import { createEnumParser } from "@/lib/objectParser";

export enum ModeType {
    Draw = "draw",
    Rig = "rig",
    Play = "play",
}

export const parseModeType = createEnumParser(ModeType);
