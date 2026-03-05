import { ProgressState, ALL_BADGES, ALL_MINIGAMES } from "./types";

export const DEFAULT_PROGRESS: ProgressState = {
  version: 1,
  soundOn: true,
  bigText: false,
  colorblindHighContrast: true,
  minigames: Object.fromEntries(
    ALL_MINIGAMES.map((id) => [id, { starsBest: 0, plays: 0 }])
  ) as ProgressState["minigames"],
  badges: Object.fromEntries(ALL_BADGES.map((b) => [b, false])) as ProgressState["badges"]
};