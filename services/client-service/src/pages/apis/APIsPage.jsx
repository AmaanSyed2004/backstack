"use client";

import { Key, Copy, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

const apiKeys = [
  {
    id: 1,
    name: "Production API Key",
    key: "sk_live_51234567890abcdef",
    created: "Oct 15, 2024",
    lastUsed: "2 hours ago",
    status: "Active",
    requests: "2.4M",
  },
  {
    id: 2,
    name: "Development API Key",
    key: "sk_test_98765432109fedcba",
    created: "Sep 20, 2024",
    lastUsed: "30 minutes ago",
    status: "Active",
    requests: "145K",
  },
  {
    id: 3,
    name: "Staging API Key",
    key: "sk_stage_abcdef1234567890",
    created: "Aug 10, 2024",
    lastUsed: "1 day ago",
    status: "Active",
    requests: "89K",
  },
];

const APIsPage = () => {
  const [visibleKeys, setVisibleKeys] = useState([]);
  const [copied, setCopied] = useState(null);

  const toggleKeyVisibility = (id) => {
    setVisibleKeys((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const maskKey = (key) => {
    return key.slice(0, 7) + "•".repeat(key.length - 14) + key.slice(-7);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-white">
                API Keys
              </h1>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              <Plus className="w-5 h-5" />
              Create New Key
            </button>
          </div>
          <p className="text-lg text-gray-400">
            Manage your API keys and access tokens
          </p>
        </div>

        {/* API Keys List */}
        <div className="space-y-4">
          {apiKeys.map((apiKey) => (
            <Card
              key={apiKey.id}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {apiKey.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Created {apiKey.created}
                      </p>
                    </div>
                    <span className="px-3 py-1 text-sm bg-emerald-500/20 text-emerald-300 rounded-full">
                      {apiKey.status}
                    </span>
                  </div>

                  {/* Key Display */}
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-2">API Key</p>
                        <code className="text-sm font-mono text-gray-300">
                          {visibleKeys.includes(apiKey.id)
                            ? apiKey.key
                            : maskKey(apiKey.key)}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="p-2 hover:bg-zinc-700 rounded transition-colors"
                          title={
                            visibleKeys.includes(apiKey.id) ? "Hide" : "Show"
                          }
                        >
                          {visibleKeys.includes(apiKey.id) ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                          className="p-2 hover:bg-zinc-700 rounded transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-5 h-5 text-gray-400" />
                        </button>
                        {copied === apiKey.id && (
                          <span className="text-xs text-emerald-400">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats and Actions */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-zinc-800/30 rounded p-3">
                      <p className="text-xs text-gray-400">Last Used</p>
                      <p className="text-sm font-medium text-white mt-1">
                        {apiKey.lastUsed}
                      </p>
                    </div>
                    <div className="bg-zinc-800/30 rounded p-3">
                      <p className="text-xs text-gray-400">Requests (30d)</p>
                      <p className="text-sm font-medium text-white mt-1">
                        {apiKey.requests}
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-2 text-sm text-gray-300 hover:bg-zinc-800 rounded transition-colors">
                        Rotate
                      </button>
                      <button className="px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create New Key Section */}
        <Card className="bg-zinc-900 border border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Create New API Key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Key Name
              </label>
              <input
                type="text"
                placeholder="e.g., Mobile App, Third-party Integration"
                className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Environment
              </label>
              <select className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-white transition-colors">
                <option>Production</option>
                <option>Staging</option>
                <option>Development</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button className="flex-1 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Create Key
              </button>
              <button className="flex-1 px-4 py-2 bg-zinc-800 text-white rounded-lg font-semibold hover:bg-zinc-700 transition-colors">
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default APIsPage;
