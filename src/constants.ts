export const PRINTER_TOLERANCE = 0.02;
export const CLEARANCE_SUPERTIGHT = PRINTER_TOLERANCE;
export const CLEARANCE_TIGHT = 0.1;
export const CLEARANCE_NORMAL = 0.2;
export const CLEARANCE_LOOSE = 0.5;

export enum Clearance {
  Supertight = PRINTER_TOLERANCE,
  Tight = 0.1,
  Normal = 0.2,
  Loose = 0.5,
}

export const MIN_WALL_SIZE = 1;
