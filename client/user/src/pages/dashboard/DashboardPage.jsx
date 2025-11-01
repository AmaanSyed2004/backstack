"use client";

import { LayoutDashboard, TrendingUp, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/sidebar";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const performanceData = [
  { time: "00:00", requests: 1200, errors: 45, latency: 120 },
  { time: "04:00", requests: 1900, errors: 60, latency: 145 },
  { time: "08:00", requests: 2800, errors: 35, latency: 98 },
  { time: "12:00", requests: 3900, errors: 28, latency: 85 },
  { time: "16:00", requests: 3200, errors: 42, latency: 110 },
  { time: "20:00", requests: 2100, errors: 55, latency: 135 },
  { time: "24:00", requests: 1400, errors: 38, latency: 105 },
];

const serviceHealth = [
  { service: "Auth", uptime: 99.98, status: "Healthy" },
  { service: "API Gateway", uptime: 99.95, status: "Healthy" },
  { service: "Database", uptime: 99.99, status: "Healthy" },
  { service: "Cache", uptime: 99.92, status: "Healthy" },
];

const recentActivity = [
  {
    action: "API Key Created",
    service: "Production",
    time: "2 hours ago",
    status: "success",
  },
  {
    action: "Schema Updated",
    service: "User Service",
    time: "4 hours ago",
    status: "success",
  },
  {
    action: "Deployment",
    service: "CRUD Service",
    time: "6 hours ago",
    status: "success",
  },
  {
    action: "Alert Triggered",
    service: "Database",
    time: "8 hours ago",
    status: "warning",
  },
  {
    action: "Backup Completed",
    service: "Storage",
    time: "12 hours ago",
    status: "success",
  },
];

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white">
              Overview
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            System health and performance metrics
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Requests</p>
                  <p className="text-3xl font-bold text-white mt-2">18.6M</p>
                  <p className="text-xs text-emerald-400 mt-2">
                    ↑ 12% from last week
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Uptime</p>
                  <p className="text-3xl font-bold text-white mt-2">99.96%</p>
                  <p className="text-xs text-emerald-400 mt-2">
                    All systems operational
                  </p>
                </div>
                <Zap className="w-8 h-8 text-emerald-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Avg Latency</p>
                  <p className="text-3xl font-bold text-white mt-2">108ms</p>
                  <p className="text-xs text-emerald-400 mt-2">Within SLA</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Users</p>
                  <p className="text-3xl font-bold text-white mt-2">2,847</p>
                  <p className="text-xs text-emerald-400 mt-2">↑ 8% today</p>
                </div>
                <Users className="w-8 h-8 text-emerald-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">
                  Request Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="time" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      stroke="#ffffff"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Latency Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient
                        id="colorLatency"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#ffffff"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ffffff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="time" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="latency"
                      stroke="#ffffff"
                      fillOpacity={1}
                      fill="url(#colorLatency)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Service Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {serviceHealth.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-800/50 rounded border border-zinc-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-white">
                        {service.service}
                      </p>
                      <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-300 rounded">
                        {service.status}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-1.5">
                      <div
                        className="bg-white h-1.5 rounded-full"
                        style={{ width: `${service.uptime}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {service.uptime}% uptime
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentActivity.map((activity, idx) => (
                  <div
                    key={idx}
                    className="p-2 text-xs border-b border-zinc-800 last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">{activity.action}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          activity.status === "success"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                      {activity.service} • {activity.time}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
