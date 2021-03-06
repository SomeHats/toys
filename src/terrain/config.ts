export const SIZE = Math.max(window.innerWidth, window.innerHeight);

export const POINT_SPACING = 5;
export const TARGET_CELLS_PER_PLATE = 1600;

export const MIN_PLATE_BASE_HEIGHT = -0.9;
export const MAX_PLATE_BASE_HEIGHT = 0.45;

export const CELL_HEIGHT_NOISE_AMT = 0.3;
export const CELL_NOISE_SCALE = (1 / POINT_SPACING) * 0.1;

export const CELL_SMOOTH_MIN_RADIUS = POINT_SPACING * 10;
export const CELL_SMOOTH_MAX_RADIUS = POINT_SPACING * 20;
export const CELL_SMOOTH_NOISE_SCALE = (1 / POINT_SPACING) * 0.9;

export const MIN_TECTONIC_DRIFT = 0.5;
export const MAX_TECTONIC_DRIFT = 1;
export const MIN_DRIFT_MAGNITUDE_TO_PROPAGATE = 0.005;
export const DRIFT_NOISE_SCALE = (1 / POINT_SPACING) * 0.1;
export const DRIFT_NOISE_AMT = 1;
