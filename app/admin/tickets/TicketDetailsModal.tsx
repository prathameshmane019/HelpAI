"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ticket } from "@/lib/TicketTypes";
import { BadgeCheck, Mail, UserCircle, Info } from "lucide-react";

interface TicketDetailsModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export default function TicketDetailsModal({
  ticket,
  onClose,
}: TicketDetailsModalProps) {
  if (!ticket) return null;
  return (
    <Dialog open={!!ticket} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info size={22} /> Ticket Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-gray-500">Title</p>
            <p className="font-medium">{ticket.title}</p>
          </div>

          <div>
            <p className="text-gray-500">Description</p>
            <p className="font-medium">{ticket.description}</p>
          </div>

          <div>
            <p className="text-gray-500">Category</p>
            <p className="font-medium">{ticket.category}</p>
          </div>

          <div>
            <p className="text-gray-500">Priority</p>
            <p className="font-medium">{ticket.priority}</p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium">{ticket.status}</p>
          </div>

          <div className="flex items-center gap-3">
            <UserCircle size={20} className="text-gray-600" />
            <div>
              <p className="text-gray-500">Created by</p>
              <p className="font-medium">{ticket.userEmail || "Unknown"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail size={20} className="text-gray-600" />
            <div>
              <p className="text-gray-500">Assigned to</p>
              <p className="font-medium">
                {ticket.assignedTo || "Not Assigned"}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
