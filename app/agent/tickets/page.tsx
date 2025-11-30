"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { listTickets, updateTicketStatus, assignTicket } from "@/lib/api";
import type { Ticket } from "@/lib/TicketTypes";
import TicketCard from "@/components/TicketCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCheck } from "lucide-react";
import ViewTicket from "@/components/tickets/ViewTicket";

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

export default function AgentTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const userEmail = getCurrentUserEmail();
    setEmail(userEmail);
  }, []);

  async function loadTickets() {
    if (!email) return;
    try {
      setLoading(true);

      const t = (await listTickets()) as Ticket[];

      const mineOrUnassigned = (t || []).filter(
        (ticket) => ticket.assignedTo === email || !ticket.assignedTo
      );

      setTickets(mineOrUnassigned);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (email) loadTickets();
  }, [email]);

  async function handleStatusChange(id: number, status: string) {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket || ticket.assignedTo !== email) return;

    try {
      await updateTicketStatus(id, status);
      toast.success("Ticket status updated");
      await loadTickets();
    } catch (err) {
      toast.error("Failed to update ticket status");
    }
  }

  async function handleAssignToSelf(id: number) {
    if (!email) return;

    try {
      await assignTicket(id, email);
      toast.success("Ticket assigned to you");
      await loadTickets();
    } catch (err) {
      toast.error("Failed to assign ticket");
    }
  }

  return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Tickets</h1>

        <Button variant="outline" size="sm" onClick={loadTickets}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => {
              setSelectedTicket(ticket);
              setDialogOpen(true);
            }}
          >
            <TicketCard ticket={ticket} />

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status:</span>

                <Select
                  value={ticket.status || "OPEN"}
                  onValueChange={(val) => handleStatusChange(ticket.id, val)}
                  disabled={ticket.assignedTo !== email}
                >
                  <SelectTrigger className="h-8 w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="OPEN">OPEN</SelectItem>
                    <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                    <SelectItem value="RESOLVED">RESOLVED</SelectItem>
                    <SelectItem value="CLOSED">CLOSED</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!ticket.assignedTo && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAssignToSelf(ticket.id);
                  }}
                  className="flex items-center gap-1"
                >
                  <UserCheck className="w-4 h-4" />
                  Assign to Me
                </Button>
              )}

              {ticket.assignedTo && (
                <p className="text-xs text-muted-foreground">
                  Assigned to: <span className="font-medium">{ticket.assignedTo}</span>
                </p>
              )}
            </div>
          </div>
        ))}

        {tickets.length === 0 && !loading && (
          <p className="text-sm text-muted-foreground">
            No tickets available for assignment.
          </p>
        )}
      </div>

      <ViewTicket
        ticket={selectedTicket}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
