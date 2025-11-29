"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import type { Ticket } from "@/lib/TicketTypes";

export default function ViewTicket({
  ticket,
  open,
  onClose,
}: {
  ticket: Ticket | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Ticket Details</DialogTitle>
        </DialogHeader>

        {ticket && (
          <div className="space-y-3 mt-4 text-sm">
            <div>
              <strong>Title:</strong> {ticket.title}
            </div>

            <div>
              <strong>Description:</strong> {ticket.description}
            </div>

            <div>
              <strong>Status:</strong> {ticket.status}
            </div>

            <div>
              <strong>Priority:</strong> {ticket.priority}
            </div>

            <div>
              <strong>Category:</strong> {ticket.category}
            </div>

            <div>
              <strong>Assigned To:</strong>{" "}
              {ticket.assignedTo || "Unassigned"}
            </div>

            <div>
 <strong>Created:</strong>{" "}
              {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}
            </div>

            <div>
 <strong>Updated:</strong>{" "}
              {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : 'N/A'}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
