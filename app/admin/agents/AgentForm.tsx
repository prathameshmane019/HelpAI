"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createAgent, updateUser } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Agent } from "@/lib/AgentTypes";

export default function AgentForm({
  open,
  onClose,
  onSuccess,
  editData,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData: Agent | null;
}) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        username: editData.username,
        email: editData.email,
        password: "",
      });
    } else {
      setForm({ username: "", email: "", password: "" });
    }
  }, [editData]);

  const submit = async () => {
    try {
      if (editData) {
        await updateUser(String(editData.id), {
          username: form.username,
          email: form.email,
        });
        toast.success("Agent updated successfully");
      } else {
        await createAgent({ ...form, role: "AGENT" });
        toast.success("Agent created successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(editData ? "Failed to update agent" : "Failed to create agent");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Agent" : "Add Agent"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Agent name"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {!editData && (
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          )}

          <Button className="w-full" onClick={submit}>
            {editData ? "Update Agent" : "Create Agent"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
