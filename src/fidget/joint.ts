import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import {
  cuboid,
  cylinder,
  roundedCuboid,
  sphere,
} from "@jscad/modeling/src/primitives";
import { MIN_WALL_SIZE, PRINTER_TOLERANCE } from "../constants";
import { translate } from "@jscad/modeling/src/operations/transforms";
import { BASE_SIZE } from "./constants";
import { ball } from "./ball";

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

function createSocketBodyCB({ socketWidth, socketHeight, segments }) {
  return roundedCuboid({
    size: [socketWidth, socketWidth, socketHeight],
    roundRadius: 5,
    segments,
  });
}

export function joint({
  ballClearance = PRINTER_TOLERANCE,
  ballRadius = BASE_SIZE,
  ballPressFitTolerance = 5,
  socketWall = MIN_WALL_SIZE,
  segments = 100,
} = {}) {
  const fidgetBall = ball({ radius: ballRadius, segments });

  // отверстие во втулке, чтобы шарнир свободно вращался
  const socketClearanceHole = sphere({
    radius: ballRadius + ballClearance,
    segments,
  });

  const socketHeight = ballRadius + socketWall + ballPressFitTolerance;
  const socketWidth = (ballRadius + socketWall) * 2;
  // const socketBody = createSocketBody({
  const socketBody = createSocketBodyCB({
    socketWidth,
    socketHeight,
    segments,
  });

  const socket = subtract(
    translate([0, 0, -(socketHeight / 2 - ballPressFitTolerance)], socketBody),
    socketClearanceHole,
  );

  return [socket, fidgetBall];
}
