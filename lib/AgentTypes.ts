// lib/AgentTypes.ts

export interface Agent {
  id: number;
  username: string;
  email: string;
  role: "AGENT" | "ADMIN";
}
