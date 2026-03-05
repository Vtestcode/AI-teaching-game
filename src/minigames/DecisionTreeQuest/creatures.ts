export type CreatureClass = "Floof" | "Bouncer";

export type Creature = {
  id: string;
  hasHorns: boolean;
  hasWings: boolean;
  color: "blue" | "green" | "pink";
  clazz: CreatureClass;
};

export const CREATURES: Creature[] = [
  { id: "C1", hasHorns: true, hasWings: false, color: "blue", clazz: "Floof" },
  { id: "C2", hasHorns: true, hasWings: true, color: "green", clazz: "Floof" },
  { id: "C3", hasHorns: false, hasWings: true, color: "pink", clazz: "Bouncer" },
  { id: "C4", hasHorns: false, hasWings: false, color: "green", clazz: "Bouncer" },
  { id: "C5", hasHorns: true, hasWings: false, color: "pink", clazz: "Floof" },
  { id: "C6", hasHorns: false, hasWings: true, color: "blue", clazz: "Bouncer" }
];

export type QuestionId = "horns" | "wings" | "colorBlue" | "colorGreen" | "colorPink";

export const QUESTIONS: Record<QuestionId, { text: string; fn: (c: Creature) => boolean }> = {
  horns: { text: "Does it have horns?", fn: (c) => c.hasHorns },
  wings: { text: "Does it have wings?", fn: (c) => c.hasWings },
  colorBlue: { text: "Is it blue?", fn: (c) => c.color === "blue" },
  colorGreen: { text: "Is it green?", fn: (c) => c.color === "green" },
  colorPink: { text: "Is it pink?", fn: (c) => c.color === "pink" }
};