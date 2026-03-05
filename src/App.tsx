import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import HomeWorld from "./scenes/HomeWorld/HomeWorld";
import PatternDetective from "./minigames/PatternDetective/PatternDetective";
import TrainClassifier from "./minigames/TrainClassifier/TrainClassifier";
import SortAndLabel from "./minigames/SortAndLabel/SortAndLabel";
import DecisionTreeQuest from "./minigames/DecisionTreeQuest/DecisionTreeQuest";
import ChatbotBuddy from "./minigames/ChatbotBuddy/ChatbotBuddy";
import ProgressDashboard from "./components/ProgressDashboard";
import TopBar from "./components/TopBar";
import { useEffect } from "react";

const page = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
};

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Global keyboard hint: press "H" to go home
      if (e.key.toLowerCase() === "h") {
        window.history.pushState({}, "", "/");
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <TopBar />
      <div className="shell">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div {...page}>
                  <HomeWorld />
                </motion.div>
              }
            />
            <Route
              path="/dashboard"
              element={
                <motion.div {...page}>
                  <ProgressDashboard />
                </motion.div>
              }
            />
            <Route
              path="/minigame/pattern"
              element={
                <motion.div {...page}>
                  <PatternDetective />
                </motion.div>
              }
            />
            <Route
              path="/minigame/classifier"
              element={
                <motion.div {...page}>
                  <TrainClassifier />
                </motion.div>
              }
            />
            <Route
              path="/minigame/label"
              element={
                <motion.div {...page}>
                  <SortAndLabel />
                </motion.div>
              }
            />
            <Route
              path="/minigame/tree"
              element={
                <motion.div {...page}>
                  <DecisionTreeQuest />
                </motion.div>
              }
            />
            <Route
              path="/minigame/chat"
              element={
                <motion.div {...page}>
                  <ChatbotBuddy />
                </motion.div>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}