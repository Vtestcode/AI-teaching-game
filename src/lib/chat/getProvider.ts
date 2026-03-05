import { mockProvider } from "./mockProvider";
import { realProvider } from "./realProvider";
import { ChatProvider } from "./types";

export function getChatProvider(): ChatProvider {
  const mode = (import.meta.env.VITE_CHAT_MODE ?? "mock") as string;
  return mode === "real" ? realProvider : mockProvider;
}