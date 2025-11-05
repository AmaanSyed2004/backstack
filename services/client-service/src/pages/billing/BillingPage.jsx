import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const usageData = [
  { month: "Jan", usage: 4000, limit: 10000 },
  { month: "Feb", usage: 5200, limit: 10000 },
  { month: "Mar", usage: 6100, limit: 10000 },
  { month: "Apr", usage: 7300, limit: 10000 },
  { month: "May", usage: 8200, limit: 10000 },
  { month: "Jun", usage: 9100, limit: 10000 },
];

const costBreakdown = [
  { name: "API Calls", value: 45, color: "#ffffff" },
  { name: "Storage", value: 30, color: "#d4d4d8" },
  { name: "Bandwidth", value: 15, color: "#a1a1aa" },
  { name: "Support", value: 10, color: "#71717a" },
];

const billingHistory = [
  { date: "Oct 1, 2024", amount: "$450", status: "Paid", plan: "Pro" },
  { date: "Sep 1, 2024", amount: "$450", status: "Paid", plan: "Pro" },
  { date: "Aug 1, 2024", amount: "$450", status: "Paid", plan: "Pro" },
  { date: "Jul 1, 2024", amount: "$350", status: "Paid", plan: "Starter" },
];

const BillingPage = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white">
              Usage & Billing
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Monitor your usage and manage billing
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400">Current Usage</p>
              <p className="text-3xl font-bold text-white mt-2">9.1 GB</p>
              <p className="text-xs text-gray-500 mt-2">of 10 GB limit</p>
              <div className="w-full bg-zinc-800 rounded-full h-2 mt-3">
                <div
                  className="bg-white h-2 rounded-full"
                  style={{ width: "91%" }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border border-zinc-800">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400">Monthly Cost</p>
              <p className="text-3xl font-bold text-white mt-2">$450</p>
              <p className="text-xs text-emerald-400 mt-2">Pro Plan</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border border-zinc-800">
            <CardContent className="p-6">
              <p className="text-sm text-gray-400">API Calls</p>
              <p className="text-3xl font-bold text-white mt-2">2.4M</p>
              <p className="text-xs text-gray-500 mt-2">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Usage Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={usageData}>
                    <defs>
                      <linearGradient
                        id="colorUsage"
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
                    <XAxis dataKey="month" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="usage"
                      stroke="#ffffff"
                      fillOpacity={1}
                      fill="url(#colorUsage)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Billing History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {billingHistory.map((bill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-zinc-800/50 rounded border border-zinc-700"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {bill.date}
                      </p>
                      <p className="text-xs text-gray-400">{bill.plan}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">
                        {bill.amount}
                      </span>
                      <span className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-300 rounded">
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {costBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-gray-400">{item.name}</span>
                    <span className="text-white font-semibold">
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BillingPage;
