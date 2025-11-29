"use client";

import { useEffect, useState } from "react";
import { listTickets, listDocuments } from "@/lib/api";
import type { Ticket } from "@/lib/TicketTypes";
import type { DocumentMetadata } from "@/lib/DocumentTypes";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { FileText, Ticket as TicketIcon, Hourglass, CheckCircle } from "lucide-react";

export default function AdminDashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const t = (await listTickets()) as Ticket[];
        setTickets(t || []);

        const docsRaw = await listDocuments();
        const docsArray: DocumentMetadata[] = docsRaw
          ? Object.values(docsRaw)
          : [];
        setDocuments(docsArray);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    }
    load();
  }, []);

  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "OPEN").length;
  const progress = tickets.filter((t) => t.status === "IN_PROGRESS").length;
  const resolved = tickets.filter((t) => t.status === "RESOLVED").length;

  const chartData = [
    { status: "Open", value: open },
    { status: "In Progress", value: progress },
    { status: "Resolved", value: resolved },
  ];

  const colors = ["#f87171", "#60a5fa", "#34d399"];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 flex flex-col gap-2">
          <TicketIcon className="h-6 w-6 text-gray-700" />
          <div className="text-xs text-muted-foreground">Total Tickets</div>
          <div className="text-2xl font-bold">{total}</div>
        </Card>

        <Card className="p-4 flex flex-col gap-2">
          <Hourglass className="h-6 w-6 text-yellow-500" />
          <div className="text-xs text-muted-foreground">Open</div>
          <div className="text-2xl font-bold">{open}</div>
        </Card>

        <Card className="p-4 flex flex-col gap-2">
          <TicketIcon className="h-6 w-6 text-blue-500" />
          <div className="text-xs text-muted-foreground">In Progress</div>
          <div className="text-2xl font-bold">{progress}</div>
        </Card>

        <Card className="p-4 flex flex-col gap-2">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <div className="text-xs text-muted-foreground">Resolved</div>
          <div className="text-2xl font-bold">{resolved}</div>
        </Card>
      </div>

      {/* Ticket Status Chart */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold mb-4">Ticket Status Overview</h2>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Documents section */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Knowledge Base Files</h2>
            <span className="text-xs text-muted-foreground">
              {documents.length} files
            </span>
          </div>

          <div className="space-y-2 max-h-64 overflow-auto">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex justify-between text-sm border-b py-1 last:border-none"
              >
                <span>{doc.filename}</span>
                <span className="text-xs text-muted-foreground">
                  {doc.contentType}
                </span>
              </div>
            ))}

            {documents.length === 0 && (
              <div className="text-xs text-muted-foreground">
                No documents uploaded yet.
              </div>
            )}
          </div>
        </Card>

        {/* Documents Chart */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold mb-4">File Types Breakdown</h2>

          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={Object.entries(
                    documents.reduce((acc, d) => {
                      acc[d.contentType] = (acc[d.contentType] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([type, count]) => ({
                    type,
                    value: count,
                  }))}
                  dataKey="value"
                  nameKey="type"
                  outerRadius={80}
                >
                  {colors.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
