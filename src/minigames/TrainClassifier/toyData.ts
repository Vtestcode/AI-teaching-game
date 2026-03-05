export type Shape = "circle" | "square" | "triangle";
export type Label = "Robot" | "Alien";

export type Example = {
  color: { r: number; g: number; b: number }; // 0..255
  shape: Shape;
  label: Label;
};

export function colorToFeatures(c: Example["color"]) {
  // normalize 0..1
  return [c.r / 255, c.g / 255, c.b / 255];
}

export function shapeToOneHot(shape: Shape) {
  return shape === "circle" ? [1, 0, 0] : shape === "square" ? [0, 1, 0] : [0, 0, 1];
}

export function labelToOneHot(label: Label) {
  return label === "Robot" ? [1, 0] : [0, 1];
}

export function oneHotToLabel(v: number[]): Label {
  return v[0] >= v[1] ? "Robot" : "Alien";
}

export function makeInput(example: Example) {
  return [...colorToFeatures(example.color), ...shapeToOneHot(example.shape)];
}