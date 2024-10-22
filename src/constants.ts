export const PRINTER_TOLERANCE = 0.02;

const CLEARANCE_TIGHT = 0.1;
const CLEARANCE_NORMAL = 0.2;
const CLEARANCE_LOOSE = 0.5;

export enum Clearance {
  Supertight = PRINTER_TOLERANCE,
  Tight = CLEARANCE_TIGHT,
  Normal = CLEARANCE_NORMAL,
  Loose = CLEARANCE_LOOSE,
}

export const MIN_WALL_SIZE = 1;
