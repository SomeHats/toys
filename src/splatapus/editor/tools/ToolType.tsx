import { createEnumParser } from "@/lib/objectParser";

export enum ToolType {
    Draw = "draw",
    Rig = "rig",
    Play = "play",
}

export const parseToolType = createEnumParser(ToolType);

export enum QuickToolType {
    Pan = "quickPan",
}
