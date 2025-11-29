// app/agent/dashboard/page.tsx

"use client"; 
import { useEffect, useState } from "react";
import { listTickets } from "@/lib/api";
import type { Ticket } from "@/lib/TicketTypes";
import TicketCard from "@/components/TicketCard";
import { Card } from "@/components/ui/card";

function getCurrentUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email || payload.sub || null;
  } catch {
    return null;
  }
}

export default function AgentDashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const e = getCurrentUserEmail();
    setEmail(e);
  }, []);

  useEffect(() => {
    if (!email) return;
    async function load() {
      try {
        const t = (await listTickets()) as Ticket[];
        const mine = (t || []).filter((ticket) => ticket.assignedTo === email);
        setTickets(mine);
      } catch (err) {
        console.error("Failed to load agent tickets", err);
      }
    }
    load();
  }, [email]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Agent Dashboard</h1>

      <Card className="p-4">
        <div className="text-xs text-muted-foreground mb-1">
          Logged in as
        </div>
        <div className="text-sm font-medium">{email || "Unknown"}</div>
      </Card>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Assigned Tickets</h2>
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
        {tickets.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No tickets assigned to you yet.
          </div>
        )}
      </div>
    </div>
  );
}
