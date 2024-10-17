import { cylinder } from "@jscad/modeling/src/primitives"

export const main = (params) => {
  // Define the radius and height of the cylinder
  const radius = 10;
  const height = 50;

  // Create the cylinder
  const leg = cylinder({ radius: radius, height: height });
  console.log(leg);
  
  return [leg]
}
