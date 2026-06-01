export type TabType = "home" | "about" | "projects" | "skills" | "contact" | "dashboard" | "resume-view";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  message: string;
  timestamp: string;
  autoResponse?: string;
}
