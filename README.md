# 🤖 AI Academy (Duolingo-style AI game for kids)

A portfolio-level web game that teaches AI concepts to children ages 7–12 through short, playful mini-games.

## Stack
- React + TypeScript (Vite)
- Three.js via react-three-fiber + drei (3D Academy Hub)
- TensorFlow.js (in-browser ML demo)
- Framer Motion (smooth UI transitions)
- Optional Chatbot backend: Vercel Serverless `/api/chat` (safe key handling)

---

## Mini-games
1) 🧩 Pattern Detective — pattern recognition  
2) 🎯 Train the Classifier — training vs prediction + classification (TensorFlow.js)  
3) 🏷️ Sort & Label — labeling quality + class imbalance “bias” (non-sensitive, gentle)  
4) 🌳 Decision Tree Quest — decision trees as question games  
5) 💬 Chatbot Buddy — tutor recap + quiz, mock mode & real mode via env

---

## Run in VS Code (local)
1. Install Node.js 18+.
2. In terminal:

```bash
npm install
cp .env.example .env
npm run dev