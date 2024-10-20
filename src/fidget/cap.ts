import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { cylinder, sphere } from "@jscad/modeling/src/primitives";
import { MIN_WALL_SIZE } from "../constants";
import { translate } from "@jscad/modeling/src/operations/transforms";

const FINGER_RADIUS = 20;

export function cap({
  radius = 10,
  concaveRadius = FINGER_RADIUS,
  concaveBorder = 1,
  wallSize = MIN_WALL_SIZE,
  segments = 100,
}) {
  const concaveBorderRadius = radius - concaveBorder;
  const concaveCenter = Math.sqrt(
    concaveRadius ** 2 - concaveBorderRadius ** 2,
  );
  const height = concaveRadius - concaveCenter;

  return union(
    cylinder({
      segments,
      height: wallSize,
      radius,
      center: [0, 0, wallSize / 2],
    }),
    translate(
      [0, 0, wallSize],
      subtract(
        cylinder({
          height: height,
          radius,
          segments,
          center: [0, 0, height / 2],
        }),
        sphere({
          radius: concaveRadius,
          segments,
          center: [0, 0, concaveRadius],
        }),
      ),
    ),
  );
}
