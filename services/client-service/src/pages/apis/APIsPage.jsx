import React, { useState, useEffect } from "react";
import {
  Key,
  Copy,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  FolderPlus,
  Check,
  Database,
  MoreVertical,
  Search,
  Table,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import api from "@/api/axios";

const APIsPage = () => {
  // --- State for Projects ---
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(
    localStorage.getItem("selectedProject") || null
  );
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // --- State for Collections ---
  const [collections, setCollections] = useState([]);
  const [loadingCollections, setLoadingCollections] = useState(false);

  // --- State for API Keys ---
  const [apiKeys, setApiKeys] = useState([]);
  const [visibleKeys, setVisibleKeys] = useState([]);
  const [copied, setCopied] = useState(null);
  const [loadingKeys, setLoadingKeys] = useState(false);

  // --- State for Search ---
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");

  // Helper: auth header
  const authConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // 1. Fetch Projects on Mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/account/project", authConfig);
        const fetchedProjects = res.data.projects || [];

        setProjects(fetchedProjects);

        // Auto-select stored project OR first project
        if (fetchedProjects.length > 0) {
          if (!selectedProjectId) {
            const firstId = fetchedProjects[0].id;
            setSelectedProjectId(firstId);
            localStorage.setItem("selectedProject", firstId);
          } else {
            // Ensure stored project still exists
            const stillExists = fetchedProjects.some(
              (p) => p.id === selectedProjectId
            );
            if (!stillExists) {
              const firstId = fetchedProjects[0].id;
              setSelectedProjectId(firstId);
              localStorage.setItem("selectedProject", firstId);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    if (token) fetchProjects();
  }, [token]); // don't include selectedProjectId to avoid extra calls

  // 2. Fetch API Keys AND Collections when a Project is Selected
  useEffect(() => {
    if (!selectedProjectId || !token) return;

    const fetchData = async () => {
      setLoadingKeys(true);
      setLoadingCollections(true);

      try {
        // Fetch API Keys
        // EXPECTED RESPONSE (adjust backend accordingly):
        // { keys: [ { id, key, createdAt }, ... ] }
        const keysRes = await api.get(
          `/account/project/${selectedProjectId}/api-key`,
          authConfig
        );
        setApiKeys(keysRes.data.keys || []);

        // Fetch Collections
        // EXPECTED RESPONSE (adjust backend accordingly):
        // { collections: [ { id, name }, ... ] }
        const schemaRes = await api.get(
          `/schema/${selectedProjectId}`,
          authConfig
          // or `/schema/${selectedProjectId}/collections` depending on your backend
        );
        setCollections(schemaRes.data.collections || []);
      } catch (err) {
        console.error("Error loading project data:", err);
        setCollections([]);
        setApiKeys([]);
      } finally {
        setLoadingKeys(false);
        setLoadingCollections(false);
      }
    };

    fetchData();
  }, [selectedProjectId, token]);

  // --- Handlers ---

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      // EXPECTED BACKEND:
      // POST /account/project { name }
      // -> { projectId: "proj_..." }
      const res = await api.post(
        "/account/project",
        { name: newProjectName },
        authConfig
      );

      const newProject = { id: res.data.projectId, name: newProjectName };
      setProjects((prev) => [...prev, newProject]);
      setSelectedProjectId(newProject.id);
      localStorage.setItem("selectedProject", newProject.id);

      setIsCreatingProject(false);
      setNewProjectName("");
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project");
    }
  };

  const handleSelectProject = (projectId) => {
    setSelectedProjectId(projectId);
    localStorage.setItem("selectedProject", projectId);
  };

  const createNewKey = async () => {
    if (!selectedProjectId) return;

    try {
      // EXPECTED BACKEND:
      // POST /account/project/:projectId/api-key
      // -> { apiKey: "sk_live_..." }
      const res = await api.post(
        `/account/project/${selectedProjectId}/api-key`,
        {},
        authConfig
      );

      const newKey = {
        id: Date.now(), // Prefer backend-generated id if available
        key: res.data.apiKey,
        createdAt: new Date().toISOString(),
      };

      setApiKeys((prev) => [newKey, ...prev]);
    } catch (err) {
      console.error("Error creating API key:", err);
      alert("Failed to generate API key");
    }
  };

  const revokeKey = async (keyId) => {
    if (!selectedProjectId) return;
    try {
      // OPTIONAL BACKEND ENDPOINT:
      // DELETE /account/project/:projectId/api-key/:keyId
      await api.delete(
        `/account/project/${selectedProjectId}/api-key/${keyId}`,
        authConfig
      );
      setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
    } catch (err) {
      console.error("Error revoking API key:", err);
      alert("Failed to revoke API key");
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

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-black text-white font-sans">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto h-screen">
        {/* Top Section: Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
              Dashboard
            </h1>
            <p className="text-zinc-400">Manage your projects and keys</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsCreatingProject(!isCreatingProject)}
              className="bg-zinc-100 hover:bg-zinc-200 text-black px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium whitespace-nowrap"
            >
              <FolderPlus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>

        {/* Create Project Form */}
        {isCreatingProject && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center">
                <input
                  type="text"
                  placeholder="Enter project name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="flex-1 w-full bg-black border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
                  autoFocus
                />
                <button
                  onClick={handleCreateProject}
                  disabled={!newProjectName}
                  className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Project
                </button>
                <button
                  onClick={() => setIsCreatingProject(false)}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  Cancel
                </button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* PROJECTS TABLE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-500" />
              Projects Overview
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 text-sm rounded-full pl-9 pr-4 py-1.5 text-white focus:outline-none focus:border-zinc-600 w-48 transition-all focus:w-64"
              />
            </div>
          </div>

          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950/50 text-zinc-400 uppercase text-xs font-medium tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="px-6 py-4">Project Name</th>
                    <th className="px-6 py-4">Project ID</th>
                    <th className="px-6 py-4 text-right">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredProjects.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-8 text-center text-zinc-500"
                      >
                        No projects found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((p) => {
                      const isSelected = p.id === selectedProjectId;
                      return (
                        <tr
                          key={p.id}
                          onClick={() => handleSelectProject(p.id)}
                          className={`group transition-all cursor-pointer ${
                            isSelected
                              ? "bg-zinc-800/50 border-l-2 border-emerald-500"
                              : "hover:bg-zinc-800/30 border-l-2 border-transparent"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  isSelected ? "bg-emerald-500" : "bg-zinc-600"
                                }`}
                              />
                              <span
                                className={`font-medium ${
                                  isSelected ? "text-white" : "text-zinc-300"
                                }`}
                              >
                                {p.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-zinc-500 select-all">
                            {p.id}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${
                                isSelected
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : "bg-zinc-800 text-zinc-500 border-zinc-700"
                              }`}
                            >
                              {isSelected ? "Selected" : "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* COLLECTIONS TABLE */}
        {selectedProjectId && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Table className="w-5 h-5 text-blue-400" />
                Collections
                <span className="text-sm font-normal text-zinc-500 ml-2">
                  for {projects.find((p) => p.id === selectedProjectId)?.name}
                </span>
              </h2>
              {collections.length > 0 && (
                <span className="text-sm text-zinc-500 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                  {collections.length} Collections
                </span>
              )}
            </div>

            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-950/50 text-zinc-400 uppercase text-xs font-medium tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="px-6 py-4">Collection Name</th>
                      <th className="px-6 py-4">Collection ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {loadingCollections ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-6 py-8 text-center text-zinc-500 animate-pulse"
                        >
                          Fetching collections...
                        </td>
                      </tr>
                    ) : collections.length === 0 ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-6 py-8 text-center text-zinc-500"
                        >
                          No collections found for this project.
                        </td>
                      </tr>
                    ) : (
                      collections.map((col) => (
                        <tr
                          key={col.id}
                          className="hover:bg-zinc-800/30 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-zinc-200">
                            {col.name}
                          </td>
                          <td className="px-6 py-4 font-mono text-zinc-500 select-all">
                            {col.id}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* API Keys Section */}
        {selectedProjectId && (
          <div className="space-y-6 pt-6 border-t border-zinc-800 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                  <Key className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">API Keys</h2>
                  <p className="text-sm text-zinc-400">
                    Manage access tokens for{" "}
                    {projects.find((p) => p.id === selectedProjectId)?.name}
                  </p>
                </div>
              </div>

              <button
                onClick={createNewKey}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20"
              >
                <Plus className="w-4 h-4" />
                Generate Key
              </button>
            </div>

            {loadingKeys && (
              <div className="flex items-center justify-center py-12">
                <p className="text-zinc-500 animate-pulse">
                  Loading API keys...
                </p>
              </div>
            )}

            {!loadingKeys && apiKeys.length === 0 && (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Key className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-zinc-400">
                  No API keys found for this project.
                </p>
                <button
                  onClick={createNewKey}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mt-2 hover:underline"
                >
                  Create your first key
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {apiKeys.map((apiKey) => (
                <Card
                  key={apiKey.id}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all group"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-white">
                            Server Secret Key
                          </h3>
                          <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
                            Full Access
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500">
                          Created on{" "}
                          {new Date(apiKey.createdAt).toLocaleDateString()} at{" "}
                          {new Date(apiKey.createdAt).toLocaleTimeString()}
                        </p>
                      </div>

                      <div className="flex-1 max-w-2xl w-full">
                        <div className="bg-black rounded-lg p-3 border border-zinc-800 group-hover:border-zinc-700 transition-colors flex items-center justify-between gap-3 relative">
                          <div className="font-mono text-sm text-zinc-300 truncate w-full">
                            {visibleKeys.includes(apiKey.id)
                              ? apiKey.key
                              : maskKey(apiKey.key)}
                          </div>

                          <div className="flex items-center gap-1 bg-black pl-2">
                            <button
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                              title={
                                visibleKeys.includes(apiKey.id)
                                  ? "Hide"
                                  : "Show"
                              }
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
                              className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                              title="Copy"
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

                      <div className="flex justify-end">
                        <button
                          onClick={() => revokeKey(apiKey.id)}
                          className="text-xs text-red-400/60 hover:text-red-400 flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-500/5 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Revoke
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default APIsPage;
