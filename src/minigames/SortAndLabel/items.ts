export type ItemClass = "MoonKit" | "SunPup";

export type LabelItem = {
  id: string;
  trueClass: ItemClass;
  hint: string; // gentle, non-sensitive feature hints
};

export const ITEMS: LabelItem[] = [
  { id: "A1", trueClass: "MoonKit", hint: "Likes nighttime missions 🌙" },
  { id: "A2", trueClass: "MoonKit", hint: "Glows softly in the dark ✨" },
  { id: "A3", trueClass: "MoonKit", hint: "Sleeps in a cozy crater 💤" },

  // More SunPup than MoonKit to demonstrate class imbalance
  { id: "B1", trueClass: "SunPup", hint: "Loves sunny fields ☀️" },
  { id: "B2", trueClass: "SunPup", hint: "Wears warm colors 🟠" },
  { id: "B3", trueClass: "SunPup", hint: "Barks at bright balloons 🎈" },
  { id: "B4", trueClass: "SunPup", hint: "Collects sun stickers ⭐" },
  { id: "B5", trueClass: "SunPup", hint: "Runs faster at noon 🏃" }
];