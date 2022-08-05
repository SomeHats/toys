import Color from "color";
import { varyRelative, varyAbsolute, random, randomInt } from "../lib/utils";
import { BLUE } from "./colors";

export type PalConfig = {
    radius: number;
    bodHeight: number;
    bodBob: number;
    eyeY: number;
    eyeX: number;
    eyeRadius: number;
    mouthThickness: number;
    mouthY: number;
    mouthWidth: number;
    mouthSmile: number;
    buttTop: number;
    buttBottom: number;
    buttThickness: number;
    color: Color;
    hipHeight: number;
    kneeScale: number;
    legMaxLift: number;
    kneeMaxOut: number;
    stepDuration: number;
    stepRestDuration: number;
    stepThreshold: number;
    fullStepDistance: number;
    legWidth: number;
    legPairs: number;
};

export const classicPalConfig: PalConfig = {
    radius: 14,
    bodHeight: 25,
    bodBob: 15,
    eyeY: 6,
    eyeX: 5,
    eyeRadius: 2,
    mouthThickness: 2,
    mouthY: 2,
    mouthWidth: 8,
    mouthSmile: 4,
    buttTop: 6,
    buttBottom: 12,
    buttThickness: 1.4,
    color: BLUE.lighten(0.2),
    hipHeight: 10,
    kneeScale: 1.3,
    legMaxLift: 0.3,
    kneeMaxOut: 14,
    stepDuration: 0.2,
    stepRestDuration: 0.2,
    stepThreshold: 0.2,
    fullStepDistance: 20,
    legWidth: 4,
    legPairs: 1,
};

export const generateRandomPalConfig = (): PalConfig => {
    const radius = varyRelative(14, 0.2);
    const hipHeight = varyRelative(radius * 0.7, 0.3);
    const bodHeight = varyRelative(radius * 2, 0.3);
    const legLength = bodHeight - (radius - hipHeight); // typical: 24

    return {
        radius,
        bodHeight,
        bodBob: varyRelative(radius, 0.2),
        eyeY: varyRelative(radius * 0.5, 0.2),
        eyeX: varyRelative(radius * 0.4, 0.3),
        eyeRadius: varyRelative(radius * 0.15, 0.4),
        mouthThickness: varyRelative(radius * 0.15, 0.4),
        mouthY: varyAbsolute(0, radius * 0.2),
        mouthWidth: varyRelative(radius * 0.5, 0.3),
        mouthSmile: varyRelative(radius * 0.3, 0.3),
        buttTop: varyRelative(radius * 0.4, 0.2),
        buttBottom: varyRelative(radius * 0.85, 0.15),
        buttThickness: varyRelative(radius * 0.1, 0.5),
        color: BLUE.lighten(random(-0.2, 0.2)).saturate(random(-0.2, 0.2)).rotate(random(-10, 10)),
        hipHeight,
        kneeScale: varyAbsolute(1.3, 0.3),
        legMaxLift: random(0.2, 0.5),
        kneeMaxOut: varyRelative(legLength * 0.6, 0.4),
        stepDuration: varyRelative(legLength * 0.01, 0.4),
        stepRestDuration: varyRelative(legLength * 0.0083, 0.4),
        stepThreshold: varyRelative(legLength * 0.01, 0.4),
        fullStepDistance: varyRelative(legLength * 0.7, 0.4),
        legWidth: varyRelative(radius * 0.3, 0.4),
        legPairs: randomInt(1, 4),
    };
};
