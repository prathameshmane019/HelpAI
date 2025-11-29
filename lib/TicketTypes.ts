// lib/TicketTypes.ts

export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | string;
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT" | string;

export interface Ticket {
  id: number;
  title: string;
  description: string;
  userEmail: string;
  status: TicketStatus;
  category?: string;
  priority?: TicketPriority;
  assignedTo?: string;
  createdAt?: string;   // ISO date-time from backend
  updatedAt?: string;   // ISO date-time from backend
}
