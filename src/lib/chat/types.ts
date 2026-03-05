export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatProvider = {
  id: "mock" | "real";
  send: (messages: ChatMessage[]) => Promise<string>;
};