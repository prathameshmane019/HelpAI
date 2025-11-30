"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Agent } from "@/lib/AgentTypes";

export default function AgentTable({
  agents,
  onDelete,
  onEdit,
}: {
  agents: Agent[];
  onDelete: (id: number) => void;
  onEdit: (agent: Agent) => void;
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="p-3">{a.username}</td>
              <td className="p-3">{a.email}</td>
              <td className="p-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(a)}
                  className="flex gap-2"
                >
                  <Pencil size={16} />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(a.id)}
                  className="flex gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              </td>
            </tr>
          ))}

          {agents.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="p-4 text-center text-gray-500 italic"
              >
                No agents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
