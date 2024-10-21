import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { cube, cuboid, cylinder, sphere } from "@jscad/modeling/src/primitives";
import { cap } from "./cap";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { spring } from "../spring";
import {
  CLEARANCE_LOOSE,
  CLEARANCE_NORMAL,
  CLEARANCE_TIGHT,
} from "../constants";
import { Geom3 } from "@jscad/modeling/src/geometries/types";

export function ball({
  radius,
  buttonShaftHeight = 6,
  buttonTolerance = CLEARANCE_TIGHT,
  springTolerance = CLEARANCE_LOOSE,
  minimumWallSize = 1,
  segments,
}): Geom3[] {
  const springInsertCutSize = radius / Math.sqrt(2) - minimumWallSize;
  const springSize = springInsertCutSize - springTolerance;

  const springInsertBottomOffset = 3;
  const springInsertHeight = radius * 2 - springInsertBottomOffset;
  const springInsertCut = cuboid({
    size: [springInsertCutSize, springInsertCutSize, springInsertHeight],
    center: [0, 0, -radius + springInsertHeight / 2 + springInsertBottomOffset],
  });
  const springInsertBody = spring({
    size: [springSize, springSize, springInsertHeight],
    segments: 15,
    wireSize: 1,
    center: [0, 0, springInsertBottomOffset / 2],
  });

  const buttonRadius = radius / 2;
  const buttonBody = union(
    subtract(
      cylinder({
        radius: buttonRadius,
        height: buttonShaftHeight,
        center: [0, 0, radius - buttonShaftHeight / 2],
        segments,
      }),
      springInsertCut,
    ),
    cap({
      radius: buttonRadius,
      wallSize: 1,
      center: [0, 0, radius],
    }),
  );

  const buttonBodyPresses = translate([0, 0, -buttonShaftHeight], buttonBody);

  const buttonShaftCutHeight = buttonShaftHeight * 2;
  const buttonShaftCut = cylinder({
    radius: buttonRadius + buttonTolerance,
    height: buttonShaftCutHeight,
    center: [0, 0, radius + buttonShaftCutHeight / 2 - buttonShaftHeight * 2],
    segments,
  });
  const ballBottom = cube({
    size: radius * 2,
    center: [0, 0, -radius * 2 + springInsertBottomOffset - minimumWallSize],
  });
  const ballBody = subtract(
    sphere({ radius, segments }),
    ballBottom,
    springInsertCut,
    buttonShaftCut,
  );

  return [ballBody, buttonBody, springInsertBody];
}
