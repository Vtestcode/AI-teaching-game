export type MiniGameId = "pattern" | "classifier" | "label" | "tree" | "chat";

export type BadgeId =
  | "FirstSteps"
  | "PatternPro"
  | "TinyTrainer"
  | "FairLabeler"
  | "TreeBuilder"
  | "ChatChampion"
  | "AcademyStar";

export type MiniGameProgress = {
  starsBest: number; // 0..3
  plays: number;
  lastPlayedAt?: number;
};

export type ProgressState = {
  version: 1;
  soundOn: boolean;
  bigText: boolean;
  colorblindHighContrast: boolean;
  minigames: Record<MiniGameId, MiniGameProgress>;
  badges: Record<BadgeId, boolean>;
};

export const ALL_MINIGAMES: MiniGameId[] = [
  "pattern",
  "classifier",
  "label",
  "tree",
  "chat"
];

export const ALL_BADGES: BadgeId[] = [
  "FirstSteps",
  "PatternPro",
  "TinyTrainer",
  "FairLabeler",
  "TreeBuilder",
  "ChatChampion",
  "AcademyStar"
];