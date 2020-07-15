export declare type Noise2D = (x: number, y: number) => number;
export declare type Noise3D = (x: number, y: number, z: number) => number;
export declare type Noise4D = (x: number, y: number, z: number, w: number) => number;
export declare function makeNoise2D(clientSeed: number): Noise2D;
export declare function makeNoise3D(clientSeed: number): Noise3D;
export declare function makeNoise4D(clientSeed: number): Noise4D;
