import {
  Key,
  Copy,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  FolderPlus,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import api from "@/api/axios";

const APIsPage = () => {
  // --- State for Projects ---
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(
    localStorage.getItem("selectedProject") || null
  );
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // --- State for API Keys ---
  const [apiKeys, setApiKeys] = useState([]);
  const [visibleKeys, setVisibleKeys] = useState([]);
  const [copied, setCopied] = useState(null);
  const [loadingKeys, setLoadingKeys] = useState(false);

  const token = localStorage.getItem("token");

  // 1. Fetch Projects on Mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("account/project", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data.projects || []);

        // Auto-select first project if none selected
        if (!selectedProjectId && res.data.projects.length > 0) {
          const firstId = res.data.projects[0].id;
          setSelectedProjectId(firstId);
          localStorage.setItem("selectedProject", firstId);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, [token]);

  // 2. Fetch API Keys when a Project is Selected
  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchKeys = async () => {
      setLoadingKeys(true);
      try {
        const res = await api.get(`account/project/${selectedProjectId}/api-key`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApiKeys(res.data.keys || []);
      } catch (err) {
        console.error("Error loading API keys:", err);
      } finally {
        setLoadingKeys(false);
      }
    };

    fetchKeys();
  }, [selectedProjectId, token]);

  // --- Handlers ---

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const res = await api.post(
        "account/project",
        { name: newProjectName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newProject = { id: res.data.projectId, name: newProjectName };
      setProjects([...projects, newProject]);
      setSelectedProjectId(newProject.id);
      localStorage.setItem("selectedProject", newProject.id);
      setIsCreatingProject(false);
      setNewProjectName("");
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project");
    }
  };

  const createNewKey = async () => {
    if (!selectedProjectId) return;
    try {
      const res = await api.post(
        `account/project/${selectedProjectId}/api-key`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApiKeys((prev) => [
        {
          id: Date.now(), // Temporary ID for UI until refresh
          key: res.data.apiKey,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error creating API key:", err);
    }
  };

  const maskKey = (key) => {
    if (!key) return "";
    return (
      key.slice(0, 7) + "•".repeat(Math.max(0, key.length - 14)) + key.slice(-7)
    );
  };

  const copyToClipboard = (key, id) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleKeyVisibility = (id) => {
    setVisibleKeys((prev) =>
      prev.includes(id) ? prev.filter((k) => k !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8">
        {/* Top Section: Project Selection */}
        <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">Manage your projects and keys</p>
          </div>

          <div className="flex gap-3">
            {/* Project Dropdown / Display */}
            {projects.length > 0 && (
              <select
                value={selectedProjectId || ""}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  localStorage.setItem("selectedProject", e.target.value);
                }}
                className="bg-zinc-900 border border-zinc-700 text-white rounded px-3 py-2 outline-none focus:border-emerald-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setIsCreatingProject(!isCreatingProject)}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>

        {/* Create Project Form (Conditional) */}
        {isCreatingProject && (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-6 flex gap-4 items-center">
              <input
                type="text"
                placeholder="Enter project name..."
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="flex-1 bg-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Create Project
              </button>
            </CardContent>
          </Card>
        )}

        {/* API Keys Section (Only shows if project selected) */}
        {selectedProjectId ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-lg">
                  <Key className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">API Keys</h2>
              </div>

              <button
                onClick={createNewKey}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Generate Key
              </button>
            </div>

            {loadingKeys && <p className="text-gray-400">Loading keys...</p>}

            {!loadingKeys && apiKeys.length === 0 && (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">
                <p className="text-gray-500">
                  No API keys found for this project.
                </p>
                <button
                  onClick={createNewKey}
                  className="text-emerald-400 hover:underline mt-2"
                >
                  Create one now
                </button>
              </div>
            )}

            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <Card
                  key={apiKey.id}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            Server Key
                          </h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Created{" "}
                            {new Date(apiKey.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                          Active
                        </span>
                      </div>

                      <div className="bg-black/50 rounded-lg p-4 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 font-mono text-sm text-gray-300">
                            {visibleKeys.includes(apiKey.id)
                              ? apiKey.key
                              : maskKey(apiKey.key)}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="p-2 hover:bg-zinc-800 rounded text-gray-400 hover:text-white transition-colors"
                            >
                              {visibleKeys.includes(apiKey.id) ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                copyToClipboard(apiKey.key, apiKey.id)
                              }
                              className="p-2 hover:bg-zinc-800 rounded text-gray-400 hover:text-white transition-colors"
                            >
                              {copied === apiKey.id ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button className="text-sm text-red-400/80 hover:text-red-400 flex items-center gap-2 px-3 py-1 hover:bg-red-500/10 rounded transition-colors">
                          <Trash2 className="w-4 h-4" /> Revoke Key
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State if no project selected */
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
            <div className="p-4 bg-zinc-900 rounded-full">
              <FolderPlus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold">No Project Selected</h3>
            <p className="text-gray-400 max-w-sm">
              Create a project above to start generating API keys and managing
              your backend.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default APIsPage;
