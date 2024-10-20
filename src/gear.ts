import { Vec2 } from "@jscad/modeling/src/maths/types";
import { extrudeLinear } from "@jscad/modeling/src/operations/extrusions";
import { polygon } from "@jscad/modeling/src/primitives";

// Function to calculate the involute point for a given base radius and angle
function involutePoint(baseRadius, angle): Vec2 {
  const x = baseRadius * (Math.cos(angle) + angle * Math.sin(angle));
  const y = baseRadius * (Math.sin(angle) - angle * Math.cos(angle));
  return [x, y];
}

function generateGearPolygon1(
  numTeeth,
  baseRadius,
  addendum,
  dedendum,
  resolution
) {
  const points: Vec2[] = [];
  const pitchRadius = baseRadius / Math.cos(Math.PI / numTeeth); // Pitch radius approximation
  const toothAngle = (2 * Math.PI) / numTeeth; // Angle between each tooth

  for (let i = 0; i < numTeeth; i++) {
    const startAngle = i * toothAngle;

    // Generate involute curve points for each tooth using resolution
    for (let j = 0; j < resolution; j++) {
      const t = (j / resolution) * (Math.PI / (2 * numTeeth));
      const involute = involutePoint(baseRadius, t);
      const rotatedInvolute = rotatePoint(involute, startAngle);
      points.push(rotatedInvolute);
    }

    // Add the addendum point (tip of the tooth)
    const tipAngle = startAngle + toothAngle / 2;
    const tipPoint: Vec2 = [
      (pitchRadius + addendum) * Math.cos(tipAngle),
      (pitchRadius + addendum) * Math.sin(tipAngle),
    ];
    points.push(tipPoint);

    // Generate involute curve points on the other side of the tooth
    for (let j = resolution - 1; j >= 0; j--) {
      const t = (j / resolution) * (Math.PI / (2 * numTeeth));
      const involute = involutePoint(baseRadius, t);
      const rotatedInvolute = rotatePoint(involute, startAngle + toothAngle);
      points.push(rotatedInvolute);
    }

    // Add dedendum point (bottom of the gap between teeth)
    const dedendumPoint: Vec2 = [
      (pitchRadius - dedendum) * Math.cos(startAngle + toothAngle),
      (pitchRadius - dedendum) * Math.sin(startAngle + toothAngle),
    ];
    points.push(dedendumPoint);
  }

  // Return the polygon shape of the gear
  return polygon({ points });
}

// Function to rotate a point by an angle around the origin
function rotatePoint(point, angle): Vec2 {
  const [x, y] = point;
  const newX = x * Math.cos(angle) - y * Math.sin(angle);
  const newY = x * Math.sin(angle) + y * Math.cos(angle);
  return [newX, newY];
}

export const main = () => {
  // Parameters for the gear
  const numTeeth = 20;
  const baseRadius = 20;
  const addendum = 2;
  const dedendum = 1;
  const resolution = 10;

  // Generate the gear polygon
  const gear = generateGearPolygon(
    numTeeth,
    baseRadius,
    addendum,
    dedendum,
    resolution
  );

  return extrudeLinear({ height: 10 }, gear);
};

function generateGearPolygon(
  numTeeth,
  baseRadius,
  addendum,
  dedendum,
  resolution
) {
  const points: Vec2[] = [];
  const pitchRadius = baseRadius + dedendum; // Pitch radius calculation
  const toothAngle = (2 * Math.PI) / numTeeth; // Angle occupied by each tooth

  // Loop over each tooth to generate points
  for (let i = 0; i < numTeeth; i++) {
    const startAngle = i * toothAngle;

    // Generate points along the involute curve for the left side of the tooth
    for (let j = 0; j <= resolution; j++) {
      const t = j * 0.1; // Rolling parameter t (adjust to control involute spread)
      const involute = involutePoint(baseRadius, t);
      const rotatedInvolute = rotatePoint(involute, startAngle);
      points.push(rotatedInvolute);
    }

    // Add the addendum point (tip of the tooth)
    const tipAngle = startAngle + toothAngle / 2;
    const tipPoint: Vec2 = [
      (pitchRadius + addendum) * Math.cos(tipAngle),
      (pitchRadius + addendum) * Math.sin(tipAngle),
    ];
    points.push(tipPoint);

    // Generate points along the involute curve for the right side of the tooth
    for (let j = resolution; j >= 0; j--) {
      const t = j * 0.1;
      const involute = involutePoint(baseRadius, t);
      const rotatedInvolute = rotatePoint(involute, startAngle + toothAngle);
      points.push(rotatedInvolute);
    }

    // Add dedendum point to complete the clearance
    const dedendumAngle = startAngle + toothAngle;
    const dedendumPoint: Vec2 = [
      (pitchRadius - dedendum) * Math.cos(dedendumAngle),
      (pitchRadius - dedendum) * Math.sin(dedendumAngle),
    ];
    points.push(dedendumPoint);
  }

  // Return the polygon shape of the gear
  return polygon({ points });
}

function generateGearPolygon2(
  numTeeth,
  baseRadius,
  addendum,
  dedendum,
  resolution
) {
  const points: Vec2[] = [];
  const pitchRadius = baseRadius + addendum; // Approximate pitch circle
  const toothAngle = (2 * Math.PI) / numTeeth;

  for (let i = 0; i < numTeeth; i++) {
    const startAngle = i * toothAngle;

    // Generate involute points for the left side of the tooth
    for (let j = 0; j <= resolution; j++) {
      const t = j * 0.1; // Parameter along the involute curve
      const involute = involutePoint(baseRadius, t);
      const rotatedInvolute = rotatePoint(involute, startAngle);
      points.push(rotatedInvolute);
    }

    // Add the tip of the tooth at the addendum radius
    const tipAngle = startAngle + toothAngle / 2;
    const tipPoint: Vec2 = [
      (pitchRadius + addendum) * Math.cos(tipAngle),
      (pitchRadius + addendum) * Math.sin(tipAngle),
    ];
    points.push(tipPoint);

    // Generate involute points for the right side of the tooth
    for (let j = resolution; j >= 0; j--) {
      const t = j * 0.1; // Parameter along the involute curve
      const involute = involutePoint(baseRadius, t);
      const rotatedInvolute = rotatePoint(involute, startAngle + toothAngle);
      points.push(rotatedInvolute);
    }

    // Add a point to complete the dedendum depth
    const dedendumPoint: Vec2 = [
      (pitchRadius - dedendum) * Math.cos(startAngle + toothAngle),
      (pitchRadius - dedendum) * Math.sin(startAngle + toothAngle),
    ];
    points.push(dedendumPoint);
  }

  // Return the polygon representing the gear
  return polygon({ points });
}
