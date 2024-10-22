import { subtract } from "@jscad/modeling/src/operations/booleans";
import { sphere } from "@jscad/modeling/src/primitives";
import { MIN_WALL_SIZE, PRINTER_TOLERANCE } from "../constants";
import { BASE_SIZE } from "./constants";
import { ball } from "./ball";
import { createSocketBodyCB } from "./socket";

export function assembly({
  ballClearance = PRINTER_TOLERANCE,
  ballRadius = BASE_SIZE,
  ballPressFitTolerance = 5,
  socketWall = MIN_WALL_SIZE,
  segments = 100,
} = {}) {
  const fidgetBall = ball({ radius: ballRadius, segments });

  const socketClearanceHole = sphere({
    radius: ballRadius + ballClearance,
    segments,
  });

  const socketHeight = ballRadius + socketWall + ballPressFitTolerance;
  const socketWidth = (ballRadius + socketWall) * 2;
  // const socketBody = createSocketBody({
  const socketBody = createSocketBodyCB({
    center: [0, 0, -(socketHeight / 2 - ballPressFitTolerance)],
    socketHeight,
    socketWidth,
    segments,
  });

  const socket = subtract(socketBody, socketClearanceHole);

  return [socket, fidgetBall];
}
