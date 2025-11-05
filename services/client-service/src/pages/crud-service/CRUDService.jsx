"use client";

import { Zap, Plus, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const mockOperations = [
  { name: "Create", count: 1250, avgTime: "45ms", status: "Healthy" },
  { name: "Read", count: 5420, avgTime: "12ms", status: "Healthy" },
  { name: "Update", count: 892, avgTime: "38ms", status: "Healthy" },
  { name: "Delete", count: 234, avgTime: "25ms", status: "Healthy" },
];

const chartData = [
  { time: "00:00", create: 120, read: 240, update: 80, delete: 30 },
  { time: "04:00", create: 150, read: 280, update: 95, delete: 40 },
  { time: "08:00", create: 200, read: 350, update: 120, delete: 50 },
  { time: "12:00", create: 280, read: 420, update: 150, delete: 70 },
  { time: "16:00", create: 250, read: 380, update: 140, delete: 60 },
  { time: "20:00", create: 180, read: 300, update: 100, delete: 45 },
  { time: "24:00", create: 140, read: 260, update: 85, delete: 35 },
];

const CRUDService = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-white">
                CRUD Service
              </h1>
            </div>
            <p className="text-lg text-gray-400">
              Monitor create, read, update, and delete operations
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold">
            <Plus className="w-5 h-5" />
            New Endpoint
          </Button>
        </div>

        {/* Operations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockOperations.map((op) => (
            <Card key={op.name} className="bg-zinc-900 border border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">
                      {op.name} Operations
                    </p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {op.count.toLocaleString()}
                    </p>
                  </div>
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Response</span>
                    <span className="text-white font-mono">{op.avgTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="text-emerald-400">{op.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">
                Operations by Type (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="time" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="create" fill="#ffffff" />
                  <Bar dataKey="read" fill="#d4d4d8" />
                  <Bar dataKey="update" fill="#a1a1aa" />
                  <Bar dataKey="delete" fill="#71717a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Response Time Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="time" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="create"
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="read"
                    stroke="#d4d4d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CRUDService;
