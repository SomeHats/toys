import { createEnumParser } from "@/lib/objectParser";

export enum ToolName {
    Draw = "draw",
    KeyPoint = "keypoint",
}
export const parseToolName = createEnumParser(ToolName);
