"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { listUsers, deleteUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import AgentTable from "./AgentTable";
import AgentForm from "./AgentForm";
import { UserPlus, Users } from "lucide-react";
import { Agent } from "@/lib/AgentTypes";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);

  const loadAgents = async () => {
    const data = await listUsers();
    setAgents(data.filter((u: Agent) => u.role === "AGENT"));
  };

  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users size={26} className="text-gray-700" />
          <h1 className="text-2xl font-semibold">Agent Management</h1>
        </div>

        <Button
          onClick={() => {
            setEditAgent(null);
            setOpenForm(true);
          }}
          className="flex gap-2"
        >
          <UserPlus size={18} />
          Add Agent
        </Button>
      </div>

      {/* Agents table */}
      <AgentTable
        agents={agents}
        onDelete={async (id: number) => {
          try {
            await deleteUser(String(id));
            toast.success("Agent deleted successfully");
            await loadAgents();
          } catch (error) {
            toast.error("Failed to delete agent");
          }
        }}
        onEdit={(agent: Agent) => {
          setEditAgent(agent);
          setOpenForm(true);
        }}
      />

      {/* Form modal */}
      <AgentForm
        open={openForm}
        editData={editAgent}
        onClose={() => {
          setOpenForm(false);
          setEditAgent(null);
        }}
        onSuccess={loadAgents}
      />
    </div>
  );
}
