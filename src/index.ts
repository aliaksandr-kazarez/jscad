import { subtract } from "@jscad/modeling/src/operations/booleans";
import { cube, cuboid, cylinder, sphere } from "@jscad/modeling/src/primitives";
import { assembly } from "./fidget/assembly";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { main as gear } from "./gear";
import {
  extrudeHelical,
  extrudeLinear,
  extrudeRectangular,
  extrudeRotate,
} from "@jscad/modeling/src/operations/extrusions";
import { path2 } from "@jscad/modeling/src/geometries";

export { main } from "./fidget";
// export { main } from "./spring";

const factor = 8;

function body({ height = 185 }) {
  const one = height / factor;
  const head = sphere({ radius: one / 2 });
  const spine = cuboid({ size: [1, 1, one * 2] });
  const butt = sphere({ radius: one / 2 });
  return [
    translate([0, 0, one * 4], head),
    translate([0, 0, one * 3], spine),
    translate([0, 0, one * 2], butt),
  ];
}
