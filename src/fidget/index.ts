import { cube } from "@jscad/modeling/src/primitives";
import { joint } from "./joint";
import { BASE_SIZE } from "./constants";
import { subtract } from "@jscad/modeling/src/operations/booleans";

export const main = () => {
  const cutTool = cube({ size: 500, center: [500 / 2, 0, 0] });
  const [socket, ball] = joint({
    jointRadius: BASE_SIZE,
  });
  return [
    subtract(socket, cutTool),
    ball,
    // socket,
  ];
};
