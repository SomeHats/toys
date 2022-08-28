import { createEnumParser } from "@/lib/objectParser";

export enum ToolType {
    Draw = "draw",
    KeyPoint = "keyPoint",
}

export const parseToolType = createEnumParser(ToolType);

export enum QuickToolType {
    Pan = "quickPan",
}
