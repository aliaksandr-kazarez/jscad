import { Geom3 } from "@jscad/modeling/src/geometries/types";
import {
  intersect,
  subtract,
  union,
} from "@jscad/modeling/src/operations/booleans";
import { scale, translate } from "@jscad/modeling/src/operations/transforms";
import {
  cube,
  cuboid,
  cylinder,
  cylinderElliptic,
  sphere,
} from "@jscad/modeling/src/primitives";
import { colorize } from "@jscad/modeling/src/colors";
import { PRINTER_TOLERANCE } from "./constants";

export const main = (params) => {
  const cutTool = cube({ size: 500, center: [500 / 2, 0, 0] });
  const [socket, cone, ball] = joint({});
  // return result;
  return [subtract(socket, cutTool), ball, socket];
};

function getEndRadiusFromAngle(
  startRadius: number,
  height: number,
  angleDegrees: number
) {
  const angleRadians = angleDegrees * (Math.PI / 180);
  const topRadius = startRadius + height * Math.tan(angleRadians);
  return Math.max(topRadius, 0);
}

function joint({
  jointTolerance = PRINTER_TOLERANCE,
  jointRadius = 20,
  jointInsertTolerance = 1,
  segments = 100,
}) {
  const ball = union(
    sphere({ radius: jointRadius, segments }),
    cylinder({
      radius: jointRadius / 2,
      height: jointRadius,
      center: [0, 0, jointRadius],
    })
  );
  const ballTolerance = sphere({
    radius: jointRadius + jointTolerance,
    segments,
  });

  const movementBallRadius = jointRadius * 2;
  const movementBall = sphere({ radius: movementBallRadius, segments });

  const movementConeHeight = jointRadius + 10;
  const movementConeStartRadius = jointRadius - jointInsertTolerance;
  const movementConeTopRadius = getEndRadiusFromAngle(
    movementConeStartRadius,
    movementConeHeight,
    30
  );

  const movementCone = cylinderElliptic({
    height: movementConeHeight,
    center: [0, 0, movementConeHeight / 2],
    startRadius: [movementConeStartRadius, movementConeStartRadius], // Top of the cone (radius of 0)
    endRadius: [movementConeTopRadius, movementConeTopRadius], // Base of the cone (radius of 10)
    segments,
  });

  const socketWidth = jointRadius * 2 + 5;
  const socketHeight = jointRadius + 4 * jointInsertTolerance;
  const socket = subtract(
    cuboid({
      size: [socketWidth, socketWidth, socketHeight + 2],
      center: [0, 0, -socketHeight / 2 + 3 * jointInsertTolerance - 1],
    }),
    intersect(movementCone, movementBall),
    ballTolerance
  );

  return [socket, movementCone, ball];
}
