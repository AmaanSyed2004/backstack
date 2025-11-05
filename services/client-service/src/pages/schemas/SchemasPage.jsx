import { Database, Plus, Edit2, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";

const mockSchemas = [
  {
    id: 1,
    name: "User Schema",
    version: "2.1.0",
    status: "Active",
    fields: 12,
    lastUpdated: "2024-10-15",
  },
  {
    id: 2,
    name: "Product Schema",
    version: "1.5.3",
    status: "Active",
    fields: 18,
    lastUpdated: "2024-10-10",
  },
  {
    id: 3,
    name: "Order Schema",
    version: "3.0.0",
    status: "Active",
    fields: 15,
    lastUpdated: "2024-10-18",
  },
  {
    id: 4,
    name: "Legacy Schema",
    version: "1.0.0",
    status: "Deprecated",
    fields: 8,
    lastUpdated: "2024-01-05",
  },
];

const mockFields = [
  { name: "id", type: "UUID", required: true },
  { name: "email", type: "String", required: true },
  { name: "name", type: "String", required: true },
  { name: "createdAt", type: "Timestamp", required: true },
  { name: "metadata", type: "JSON", required: false },
];

const SchemasPage = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-white">
                Schema Registry
              </h1>
            </div>
            <p className="text-lg text-gray-400">
              Manage and version your data schemas
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold">
            <Plus className="w-5 h-5" />
            New Schema
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schemas List */}
          <div className="lg:col-span-2 space-y-4">
            {mockSchemas.map((schema) => (
              <Card
                key={schema.id}
                className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors">
                        {schema.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Version {schema.version}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        schema.status === "Active"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {schema.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-zinc-800/50 rounded border border-zinc-700">
                    <div>
                      <p className="text-xs text-gray-400">Fields</p>
                      <p className="text-lg font-semibold text-white">
                        {schema.fields}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Last Updated</p>
                      <p className="text-sm text-white">{schema.lastUpdated}</p>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-zinc-700 rounded transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-zinc-700 rounded transition-colors">
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-zinc-700 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Schema Details */}
          <div className="space-y-4">
            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">User Schema Fields</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockFields.map((field, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-800/50 rounded border border-zinc-700"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-mono text-sm text-white">
                        {field.name}
                      </p>
                      {field.required && (
                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{field.type}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">
                  Total Schemas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">24</p>
                <p className="text-xs text-gray-400 mt-2">4 deprecated</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SchemasPage;
