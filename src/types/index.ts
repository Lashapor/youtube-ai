export type Message = {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
};

export type Step = "url" | "question" | "chat";