import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import {
  cube,
  cuboid,
  cylinder,
  cylinderElliptic,
  sphere,
} from "@jscad/modeling/src/primitives";
import { cap } from "./cap";
import {
  Vec,
  rotateX,
  translate,
} from "@jscad/modeling/src/operations/transforms";
import { spring } from "../spring";
import { Clearance } from "../constants";
import { Geom3 } from "@jscad/modeling/src/geometries/types";

export function button({
  buttonRadius = 10,
  minimumWallSize = 1,
  buttonShaftHeight = 6,
  center = [0, 0, 0],
  segments = 100,
  pressFitTolerance = 1,
}) {
  const lockSkirtHeight = pressFitTolerance;
  const lockSkirt = cylinderElliptic({
    height: lockSkirtHeight,
    endRadius: [buttonRadius, buttonRadius],
    startRadius: [
      buttonRadius + pressFitTolerance / 2,
      buttonRadius + pressFitTolerance / 2,
    ],
    segments,
  });
  const buttonBody = union(
    cylinder({
      radius: buttonRadius,
      height: buttonShaftHeight,
      segments,
    }),
    translate(
      [0, 0, -buttonShaftHeight / 2 + lockSkirtHeight * 1.5],
      lockSkirt,
    ),
    translate(
      [0, 0, -buttonShaftHeight / 2 + lockSkirtHeight / 2],
      rotateX(Math.PI, lockSkirt),
    ),
    cap({
      radius: buttonRadius,
      wallSize: minimumWallSize,
      center: [0, 0, buttonShaftHeight / 2],
    }),
  );

  return translate(center as Vec, buttonBody);
}

export function ball({
  radius,
  buttonShaftHeight = 6,
  buttonTolerance = Clearance.Tight,
  springTolerance = Clearance.Loose,
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
  const buttonBody = subtract(
    button({
      pressFitTolerance: 1,
      buttonRadius,
      minimumWallSize,
      segments,
      buttonShaftHeight,
      center: [0, 0, radius - buttonShaftHeight / 2],
    }),
    springInsertCut,
  );
  const buttonBodyPresses = translate([0, 0, -buttonShaftHeight], buttonBody);

  const buttonShaftCutHeight = buttonShaftHeight * 2;
  const buttonShaftCut = cylinder({
    radius: buttonRadius + buttonTolerance + 0.5,
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

  return [
    // ballBody,
    buttonBody,
    // springInsertBody,
    // buttonBodyPresses,
  ];
}
