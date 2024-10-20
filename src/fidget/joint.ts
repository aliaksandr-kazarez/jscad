import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import { cuboid, cylinder, sphere } from "@jscad/modeling/src/primitives";
import { MIN_WALL_SIZE, PRINTER_TOLERANCE } from "../constants";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { BASE_SIZE } from "./constants";
import { createBall } from "./ball";

function createSocketBody({ socketWidth, socketHeight, segments }) {
  const bodySphereRadius = socketWidth / 2;
  const bodySphereOffset = (socketWidth - socketHeight) / 2;
  const bodySphere = sphere({
    center: [0, 0, bodySphereOffset],
    radius: bodySphereRadius,
    segments,
  });

  const bodyCylinder = cylinder({
    radius: socketWidth / 2,
    segments,
    height: socketHeight - bodySphereRadius,
    center: [0, 0, bodySphereRadius / 2],
  });

  const bodyCutTool = cuboid({
    size: [socketWidth, socketWidth, socketHeight],
    center: [0, 0, socketHeight],
  });
  return union(subtract(bodySphere, bodyCutTool), bodyCylinder);
}

export function joint({
  jointTolerance = PRINTER_TOLERANCE,
  jointRadius = BASE_SIZE,
  jointInsertTolerance = 5,
  socketWall = MIN_WALL_SIZE,
  segments = 100,
}) {
  const ball = createBall({ jointRadius, segments });

  const ballTolerance = sphere({
    radius: jointRadius + jointTolerance,
    segments,
  });

  const socketHeight = jointRadius + socketWall + jointInsertTolerance;
  const socketWidth = (jointRadius + socketWall) * 2;
  const socketBody = createSocketBody({
    socketWidth,
    socketHeight,
    segments,
  });

  const socket = subtract(
    translate([0, 0, -(socketHeight / 2 - jointInsertTolerance)], socketBody),
    ballTolerance,
  );

  return [socket, ball];
}
