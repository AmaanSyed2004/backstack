import { Shield, Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

const mockTokens = [
  {
    id: 1,
    name: "Production API Key",
    token: "sk_prod_••••••••••••••••••••••••••••••••",
    created: "2024-01-15",
    lastUsed: "2024-10-18",
    status: "Active",
  },
  {
    id: 2,
    name: "Development Key",
    token: "sk_dev_••••••••••••••••••••••••••••••••",
    created: "2024-02-20",
    lastUsed: "2024-10-19",
    status: "Active",
  },
  {
    id: 3,
    name: "Testing Key",
    token: "sk_test_•••••••••••••••••••••••••••••••",
    created: "2024-03-10",
    lastUsed: "2024-10-10",
    status: "Inactive",
  },
];

const mockMethods = [
  { id: 1, name: "Email/Password", enabled: true, users: 1250 },
  { id: 2, name: "OAuth 2.0", enabled: true, users: 3420 },
  { id: 3, name: "SAML", enabled: false, users: 0 },
  { id: 4, name: "Multi-Factor Auth", enabled: true, users: 892 },
];

const AuthService = () => {
  const [visibleTokens, setVisibleTokens] = useState([]);

  const toggleTokenVisibility = (id) => {
    setVisibleTokens((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-white">
                Auth Service
              </h1>
            </div>
            <p className="text-lg text-gray-400">
              Manage authentication methods and API keys
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold">
            <Plus className="w-5 h-5" />
            New Key
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Authentication Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">
                  Authentication Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">
                        {method.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {method.users.toLocaleString()} users
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          method.enabled
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {method.enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* API Keys */}
            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">API Keys</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockTokens.map((token) => (
                  <div
                    key={token.id}
                    className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">
                          {token.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Created {token.created}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          token.status === "Active"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {token.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3 p-2 bg-zinc-900 rounded border border-zinc-700">
                      <code className="text-xs text-gray-300 flex-1 font-mono">
                        {visibleTokens.includes(token.id)
                          ? token.token.replace(/•/g, "x")
                          : token.token}
                      </code>
                      <button
                        onClick={() => toggleTokenVisibility(token.id)}
                        className="p-1 hover:bg-zinc-800 rounded transition-colors"
                      >
                        {visibleTokens.includes(token.id) ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <button className="p-1 hover:bg-zinc-800 rounded transition-colors">
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Last used: {token.lastUsed}</span>
                      <button className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">5,562</p>
                <p className="text-xs text-emerald-400 mt-2">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">1,284</p>
                <p className="text-xs text-gray-400 mt-2">Currently online</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">
                  Failed Logins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">23</p>
                <p className="text-xs text-gray-400 mt-2">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthService;
