"use client";

import { useEffect, useState } from "react";
import { createAgent, updateUser } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AgentForm({ open, onClose, onSuccess, editData }: { open: boolean; onClose: () => void; onSuccess: () => void; editData: any }) {
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
    if (editData) {
      await updateUser(editData.id, {
        username: form.username,
        email: form.email,
      });
    } else {
      await createAgent({ ...form, role: "AGENT" });
    }

    onSuccess();
    onClose();
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
