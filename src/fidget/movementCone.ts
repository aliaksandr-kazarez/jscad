import { cylinderElliptic } from "@jscad/modeling/src/primitives";

function getEndRadiusFromAngle(
  startRadius: number,
  height: number,
  angleDegrees: number
) {
  const angleRadians = angleDegrees * (Math.PI / 180);
  const topRadius = startRadius + height * Math.tan(angleRadians);
  return Math.max(topRadius, 0);
}

export function movementCone({ jointRadius, jointInsertTolerance, segments }) {
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

  return movementCone;
}
