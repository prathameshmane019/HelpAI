"use client";

import { useEffect, useState } from "react";
import {
  listTickets,
  listUsers,
  updateTicketStatus,
  assignTicket,
  deleteTicket,
} from "@/lib/api";

import type { Ticket } from "@/lib/TicketTypes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import TicketDetailsModal from "./TicketDetailsModal";
import {
  Filter,
  RefreshCcw,
  UserCheck,
  UserCircle,
  Folder,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filtered, setFiltered] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  const [agents, setAgents] = useState([]);
  const [openDetails, setOpenDetails] = useState<Ticket | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  async function loadTickets() {
    try {
      setLoading(true);
      const t = (await listTickets()) as Ticket[];
      const a = await listUsers();

      setAgents(a.filter((x: any) => x.role === "AGENT"));
      setTickets(t || []);
      setFiltered(t || []);
    } catch (err) {
      console.error("Failed to load tickets", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, []);

  // Filtering logic
  useEffect(() => {
    let list = [...tickets];

    if (statusFilter) list = list.filter((t) => t.status === statusFilter);
    if (priorityFilter) list = list.filter((t) => t.priority === priorityFilter);
    if (categoryFilter) list = list.filter((t) => t.category === categoryFilter);

    setFiltered(list);
  }, [statusFilter, priorityFilter, categoryFilter, tickets]);

  async function handleStatusChange(id: number, status: string) {
    try {
      await updateTicketStatus(id, status);
      await loadTickets();
    } catch {
      console.error("Failed to update status");
    }
  }

  async function handleAssign(id: number, agentEmail: string) {
    try {
      await assignTicket(id, agentEmail);
      await loadTickets();
    } catch {
      console.error("Failed to assign");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteTicket(id);
      await loadTickets();
    } catch {
      console.error("Failed to delete");
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold flex items-center gap-2">
          <Folder className="text-gray-600" />
          Ticket Management
        </h1>

        <Button variant="outline" size="sm" onClick={loadTickets}>
          <RefreshCcw size={14} className="mr-2" />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* FILTERS */}
      <div className="p-4 border rounded-xl bg-gray-50 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 font-medium text-gray-700">
          <Filter size={18} /> Filters
        </div>

        {/* STATUS FILTER */}
        <Select onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>

        {/* PRIORITY */}
        <Select onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>

        {/* CATEGORY */}
        <Select onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GENERAL">General</SelectItem>
            <SelectItem value="TECHNICAL">Technical</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* TICKETS LIST */}
      <div className="space-y-4">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="border rounded-xl p-4 hover:shadow-lg transition cursor-pointer bg-white"
            onClick={() => setOpenDetails(t)}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{t.title}</h2>
                <p className="text-sm text-gray-600">{t.description}</p>

                <div className="flex gap-3 mt-2 text-xs">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Priority: <strong>{t.priority}</strong>
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Category: <strong>{t.category}</strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {/* STATUS UPDATE */}
                <Select
                  value={t.status}
                  onValueChange={(val) => handleStatusChange(t.id, val)}
                >
                  <SelectTrigger className="w-32 h-8 text-xs bg-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>

                {/* ASSIGN */}
                <Select
                  onValueChange={(email) => handleAssign(t.id, email)}
                >
                  <SelectTrigger className="w-32 h-8 text-xs bg-gray-100">
                    <SelectValue placeholder="Assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((a: any) => (
                      <SelectItem key={a.id} value={a.email}>
                        {a.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(t.id);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && !loading && (
          <div className="text-sm text-muted-foreground">
            No tickets found.
          </div>
        )}
      </div>

      {openDetails && (
        <TicketDetailsModal
          ticket={openDetails}
          onClose={() => setOpenDetails(null)}
        />
      )}
    </div>
  );
}
