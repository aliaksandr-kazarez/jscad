import { union } from "@jscad/modeling/src/operations/booleans";
import { cylinder, sphere } from "@jscad/modeling/src/primitives";
import { cap } from "./cap";
import { translate } from "@jscad/modeling/src/operations/transforms";

export function createBall({ jointRadius, segments }) {
  return union(
    sphere({ radius: jointRadius, segments }),
    cylinder({
      radius: jointRadius / 2,
      height: jointRadius,
      center: [0, 0, jointRadius / 2],
      //   segments,
    }),
    translate(
      [0, 0, jointRadius],
      cap({
        radius: jointRadius / 2,
        wallSize: 0,
      }),
    ),
  );
}
