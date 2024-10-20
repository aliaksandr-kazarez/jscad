import { extrudeRectangular } from "@jscad/modeling/src/operations/extrusions";
import { path2 } from "@jscad/modeling/src/geometries";
import { cuboid } from "@jscad/modeling/src/primitives";
import { rotate, translate } from "@jscad/modeling/src/operations/transforms";
import { Vec2 } from "@jscad/modeling/src/maths/types";
import { intersect, union } from "@jscad/modeling/src/operations/booleans";

export function spring({ segments = 10, size = [20, 20, 30], wireSize = 1 }) {
  const [width, depth, length] = size;

  const bottomBase = cuboid({
    size: [width, depth, wireSize],
  });

  const topBase = translate([0, 0, length - wireSize], bottomBase);

  const boundingCuboid = cuboid({
    size: [width, depth, length],
    center: [0, 0, length / 2],
  });

  const amplitude = depth / 2;
  const points: Vec2[] = [];
  const segmentLength = (length - wireSize) / segments;

  for (let i = 0; i <= segments; i++) {
    const x = i * segmentLength;
    const y = i % 2 === 0 ? amplitude : -amplitude;
    points.push([x, y]); // Adding z coordinate as 0
  }

  const path = path2.fromPoints({ closed: false }, points);

  const spring = extrudeRectangular(
    { size: wireSize / 2, height: width, corners: "chamfer" },
    path,
  );

  const springRotated = rotate(
    [0, -(Math.PI / 180) * 90, 0],
    translate([0, 0, -width / 2], spring),
  );

  const springBody = union(
    translate(
      [0, 0, wireSize / 2],
      bottomBase,
      rotate(
        [0, -(Math.PI / 180) * 90, 0],
        translate([0, 0, -width / 2], spring),
      ),
      topBase,
    ),
  );

  return intersect(springBody, boundingCuboid);
}
