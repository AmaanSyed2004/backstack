import React, { useState, useEffect } from "react";
import {
  Zap,
  LayoutGrid,
  Database,
  Server,
  Code,
  Check,
  Copy,
  ChevronRight,
  Box,
  Terminal,
  ArrowRight,
  Settings,
  Users,
  Key,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import api from "@/api/axios";

const EndpointCard = ({ method, url, description, body }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodColors = {
    POST: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    GET: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PUT: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div className="group bg-black/40 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all">
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-1 rounded text-xs font-bold border ${methodColors[method]}`}
            >
              {method}
            </span>
            <span className="text-zinc-400 text-sm">{description}</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="bg-zinc-950 rounded-md p-3 border border-zinc-900 font-mono text-xs text-zinc-300 flex items-center gap-2 overflow-x-auto">
          <span className="text-zinc-600 select-none">$</span>
          <span className="whitespace-nowrap">{url}</span>
        </div>

        {body && Object.keys(body).length > 0 && (
          <div className="mt-1">
            <p className="text-[10px] uppercase text-zinc-500 font-bold mb-1.5 tracking-wider">
              Request Body (example shape)
            </p>
            <pre className="bg-zinc-950/50 p-3 rounded-md text-xs text-zinc-400 font-mono overflow-x-auto border border-zinc-900">
              {JSON.stringify(
                Object.fromEntries(
                  Object.entries(body).map(([key, def]) => [
                    key,
                    def.type ?? "any",
                  ])
                ),
                null,
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const CRUDService = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const authConfig = token
    ? {
        headers: { Authorization: `Bearer ${token}` },
      }
    : {};

  // This should point to your **API gateway** that fronts the CRUD service.
  // Example: VITE_API_BASE_URL = "https://api.backstack.dev"
  const BASE_URL = `${
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
  }/crud`;

  // 1) Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const res = await api.get("/account/project", authConfig);
        const list = res.data.projects || [];
        setProjects(list);

        if (list.length > 0 && !selectedProjectId) {
          setSelectedProjectId(list[0].id);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    };

    if (token) {
      fetchProjects();
    }
  }, [token]);

  // 2) Fetch collections for selected project
  useEffect(() => {
    if (!selectedProjectId || !token) return;

    const fetchCollections = async () => {
      try {
        setLoadingCollections(true);
        const res = await api.get(`/schema/${selectedProjectId}`, authConfig);
        const cols = res.data.collections || [];
        setCollections(cols);
        setSelectedCollection(cols.length > 0 ? cols[0] : null);
      } catch (err) {
        console.error("Error fetching collections:", err);
        setCollections([]);
        setSelectedCollection(null);
      } finally {
        setLoadingCollections(false);
      }
    };

    fetchCollections();
  }, [selectedProjectId, token]);

  const selectedProjectName =
    projects.find((p) => p.id === selectedProjectId)?.name || "Select project";

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Section */}
        <header className="px-8 py-6 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <Server className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  CRUD Service
                </h1>
                <p className="text-sm text-zinc-400">
                  Dynamic REST endpoints generated from your schemas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-zinc-500">Project context:</label>
              <div className="relative">
                <select
                  value={selectedProjectId || ""}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  disabled={loadingProjects || projects.length === 0}
                  className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-lg pl-3 pr-8 py-2 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-56 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {projects.length === 0 && (
                    <option value="">No projects found</option>
                  )}
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ArrowRight className="w-3 h-3 text-zinc-500 rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Collections List */}
          <div className="w-72 border-r border-zinc-800 bg-zinc-950/30 flex flex-col">
            <div className="p-4 border-b border-zinc-800">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                <Database className="w-3 h-3" />
                Collections
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
              {loadingCollections ? (
                <div className="text-zinc-500 text-sm p-4 text-center animate-pulse">
                  Loading schemas...
                </div>
              ) : collections.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-zinc-500 mb-2">
                    No collections found for this project.
                  </p>
                  <button className="text-xs text-emerald-400 hover:underline">
                    Create Schema
                  </button>
                </div>
              ) : (
                collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedCollection(col)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group ${
                      selectedCollection?.id === col.id
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Box className="w-4 h-4 opacity-70" />
                      {col.name}
                    </span>
                    {selectedCollection?.id === col.id && (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Endpoint Playground */}
          <div className="flex-1 overflow-y-auto bg-zinc-950/50 p-8 custom-scrollbar">
            {selectedCollection ? (
              <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Info Banner */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-900/50 border border-zinc-800">
                  <div className="p-2 bg-black rounded-lg border border-zinc-800">
                    <Code className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-1">
                      Endpoints for{" "}
                      <span className="text-emerald-400 font-mono">
                        /{selectedCollection.name}
                      </span>
                    </h2>
                    <p className="text-sm text-zinc-400">
                      These endpoints are automatically generated from your
                      schema in project{" "}
                      <span className="font-medium text-zinc-300">
                        {selectedProjectName}
                      </span>
                      .
                    </p>
                  </div>
                </div>

                {/* Endpoints Grid */}
                <div className="grid gap-6">
                  {/* CREATE */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-500" /> Create
                      Record
                    </h3>
                    <EndpointCard
                      method="POST"
                      url={`${BASE_URL}/${selectedProjectId}/${selectedCollection.name}`}
                      description="Insert a new record into the collection."
                      body={selectedCollection.fields}
                    />
                  </div>

                  {/* READ (List) */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-blue-500" /> Read
                      Records
                    </h3>
                    <EndpointCard
                      method="GET"
                      url={`${BASE_URL}/${selectedProjectId}/${selectedCollection.name}?limit=25&offset=0`}
                      description="Retrieve a paginated list of records."
                    />
                  </div>

                  {/* READ (Single) */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                      <Search className="w-4 h-4 text-blue-500" /> Read Single
                    </h3>
                    <EndpointCard
                      method="GET"
                      url={`${BASE_URL}/${selectedProjectId}/${selectedCollection.name}/:id`}
                      description="Retrieve a single record by its ID."
                    />
                  </div>

                  {/* UPDATE */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-orange-500" /> Update
                      Record
                    </h3>
                    <EndpointCard
                      method="PUT"
                      url={`${BASE_URL}/${selectedProjectId}/${selectedCollection.name}/:id`}
                      description="Update an existing record by ID."
                      body={selectedCollection.fields}
                    />
                  </div>

                  {/* DELETE */}
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-red-500" /> Delete Record
                    </h3>
                    <EndpointCard
                      method="DELETE"
                      url={`${BASE_URL}/${selectedProjectId}/${selectedCollection.name}/:id`}
                      description="Permanently remove a record by ID."
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-500 space-y-4">
                <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-2">
                  <Zap className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-xl font-medium text-white">
                  No Collection Selected
                </h3>
                <p className="max-w-md">
                  Select a collection from the sidebar to view its dynamic CRUD
                  endpoints and documentation.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Utility Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(63, 63, 70, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(161, 161, 170, 0.5);
        }
      `}</style>
    </div>
  );
};

export default CRUDService;
