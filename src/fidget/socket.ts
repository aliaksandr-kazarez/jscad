import { Vec3 } from "@jscad/modeling/src/maths/types";
import { subtract, union } from "@jscad/modeling/src/operations/booleans";
import {
  cuboid,
  cylinder,
  roundedCuboid,
  sphere,
} from "@jscad/modeling/src/primitives";

export function createSocketBody({
  socketWidth,
  socketHeight,
  segments,
  // TODO: implement center
  center: [dx, dy, dz] = [0, 0, 0],
}) {
  const bodySphereRadius = socketWidth / 2;
  const bodySphereOffset = (socketWidth - socketHeight) / 2;

  const bodySphere = sphere({
    center: [dx, dy, dz + bodySphereOffset],
    radius: bodySphereRadius,
    segments,
  });

  const bodyCylinder = cylinder({
    radius: socketWidth / 2,
    segments,
    height: socketHeight - bodySphereRadius,
    center: [dx, dy, dz + bodySphereRadius / 2],
  });

  const bodyCutTool = cuboid({
    size: [socketWidth, socketWidth, socketHeight],
    center: [dx, dy, dz + socketHeight],
  });
  return union(subtract(bodySphere, bodyCutTool), bodyCylinder);
}

export function createSocketBodyCB({
  center = [0, 0, 0],
  socketWidth,
  socketHeight,
  segments,
}) {
  return roundedCuboid({
    center: center as Vec3,
    size: [socketWidth, socketWidth, socketHeight],
    roundRadius: 5,
    segments,
  });
}
