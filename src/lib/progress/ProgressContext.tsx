import React, { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_PROGRESS } from "./defaultState";
import { ProgressState, MiniGameId, BadgeId } from "./types";
import { lsGet, lsSet } from "../storage";

const KEY = "ai_academy_progress_v1";

type ProgressCtx = {
  state: ProgressState;
  setStars: (id: MiniGameId, stars: number) => void;
  grantBadge: (badge: BadgeId) => void;
  toggleSound: () => void;
  toggleBigText: () => void;
  toggleHighContrast: () => void;
  resetAll: () => void;
};

const Ctx = createContext<ProgressCtx | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => lsGet(KEY, DEFAULT_PROGRESS));

  const api = useMemo<ProgressCtx>(() => {
    const persist = (next: ProgressState) => {
      setState(next);
      lsSet(KEY, next);
    };

    const setStars = (id: MiniGameId, stars: number) => {
      const s = Math.max(0, Math.min(3, stars));
      const prev = state.minigames[id];
      const next: ProgressState = {
        ...state,
        minigames: {
          ...state.minigames,
          [id]: {
            ...prev,
            plays: prev.plays + 1,
            starsBest: Math.max(prev.starsBest, s),
            lastPlayedAt: Date.now()
          }
        }
      };
      // Badge logic
      const withBadges = awardBadges(next);
      persist(withBadges);
    };

    const grantBadge = (badge: BadgeId) => {
      if (state.badges[badge]) return;
      const next: ProgressState = { ...state, badges: { ...state.badges, [badge]: true } };
      persist(next);
    };

    const toggleSound = () => persist({ ...state, soundOn: !state.soundOn });
    const toggleBigText = () => persist({ ...state, bigText: !state.bigText });
    const toggleHighContrast = () =>
      persist({ ...state, colorblindHighContrast: !state.colorblindHighContrast });

    const resetAll = () => persist(DEFAULT_PROGRESS);

    return {
      state,
      setStars,
      grantBadge,
      toggleSound,
      toggleBigText,
      toggleHighContrast,
      resetAll
    };
  }, [state]);

  // Apply accessibility classes globally
  React.useEffect(() => {
    document.body.style.fontSize = state.bigText ? "18px" : "16px";
  }, [state.bigText]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

function awardBadges(s: ProgressState): ProgressState {
  const badges = { ...s.badges };
  const totalStars = Object.values(s.minigames).reduce((sum, m) => sum + m.starsBest, 0);

  badges.FirstSteps = badges.FirstSteps || Object.values(s.minigames).some((m) => m.plays > 0);
  badges.PatternPro = badges.PatternPro || s.minigames.pattern.starsBest >= 3;
  badges.TinyTrainer = badges.TinyTrainer || s.minigames.classifier.starsBest >= 3;
  badges.FairLabeler = badges.FairLabeler || s.minigames.label.starsBest >= 3;
  badges.TreeBuilder = badges.TreeBuilder || s.minigames.tree.starsBest >= 3;
  badges.ChatChampion = badges.ChatChampion || s.minigames.chat.starsBest >= 3;
  badges.AcademyStar = badges.AcademyStar || totalStars >= 12;

  return { ...s, badges };
}

export function useProgress() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}