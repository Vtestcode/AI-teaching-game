import { ChatProvider, ChatMessage } from "./types";

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function lastUser(messages: ChatMessage[]) {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

export const mockProvider: ChatProvider = {
  id: "mock",
  async send(messages) {
    const user = lastUser(messages).toLowerCase();

    // Very kid-friendly, safe “tutor logic”
    if (user.includes("quiz") || user.includes("question")) {
      return "Quiz time! 🤖✨ If I show the AI 10 pictures of blue stars and 1 picture of red stars, do you think it will get *better* at blue or red? Why?";
    }

    if (user.includes("bias") || user.includes("unfair")) {
      return "Great noticing! Bias can happen when the training examples are *not balanced*. If the AI mostly sees one type, it may guess that type too often. A fair fix is to collect more examples of the missing type.";
    }

    if (user.includes("accuracy")) {
      return "Accuracy means: how many guesses were correct out of all guesses. More clean data + enough practice (training) usually makes accuracy go up!";
    }

    if (user.includes("pattern")) {
      return "Patterns are repeats or rules, like: 🔵🟡🔵🟡… AI looks for these rules so it can predict what comes next.";
    }

    if (user.includes("train") || user.includes("training")) {
      return "Training is when the AI practices with examples. Prediction is when it tries on a new example it hasn’t seen before.";
    }

    return pick([
      "I’m your Robot Tutor! 🤖 Tell me what you just learned, and I’ll give you a superpower tip!",
      "Nice work! Want a quick quiz? Type: “quiz me”.",
      "Tip: AI learns from examples—so good examples = good learning!"
    ]);
  }
};