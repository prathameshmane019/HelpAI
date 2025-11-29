// components/TicketCard.tsx
 
import type { Ticket } from "@/lib/TicketTypes";
import { Card } from "@/components/ui/card";

interface TicketCardProps {
  ticket: Ticket;
  onClick?: () => void;
  className?: string;
}

export function TicketCard({ ticket, onClick, className }: TicketCardProps) {
  return (
    <Card
      onClick={onClick}
      className={`p-4 cursor-pointer hover:bg-accent transition flex justify-between items-start ${className || ""}`}
    >
      <div className="space-y-1">
        <div className="font-semibold text-sm">{ticket.title}</div>
        <div className="text-xs text-muted-foreground">
          #{ticket.id} • {ticket.userEmail}
        </div>
        {ticket.category && (
          <div className="text-[11px] text-muted-foreground">
            Category: {ticket.category}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-[11px] px-2 py-1 rounded-full bg-gray-100">
          {ticket.status || "UNKNOWN"}
        </span>
        {ticket.priority && (
          <span className="text-[11px] px-2 py-1 rounded-full bg-gray-100">
            {ticket.priority}
          </span>
        )}
        {ticket.assignedTo && (
          <span className="text-[11px] text-muted-foreground">
            {ticket.assignedTo}
          </span>
        )}
      </div>
    </Card>
  );
}

export default TicketCard;
