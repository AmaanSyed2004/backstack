import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Database,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Search,
  X,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import api from "@/api/axios";


const SchemasPage = () => {
  // Projects
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);

  // Selected project
  const [selectedProject, setSelectedProject] = useState(null);

  // Schemas for selected project
  const [schemas, setSchemas] = useState([]);
  const [schemasLoading, setSchemasLoading] = useState(false);
  const [schemasError, setSchemasError] = useState(null);

  // UI state
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("lastUpdated");

  // create schema modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    version: "1.0.0",
    description: "",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  // selected schema to view details
  const [selectedSchema, setSelectedSchema] = useState(null);

  useEffect(() => {
    if (!selectedProject) {
      setSchemas([]);
      setSelectedSchema(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setSchemasLoading(true);
      setSchemasError(null);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const { data } = await api.get(
          `/schema/${selectedProject.id}`
        );
        if (cancelled) return;
        setSchemas(Array.isArray(data) ? data : []);
        setSelectedSchema(Array.isArray(data) && data.length ? data[0] : null);
      } catch (err) {
        console.error("load schemas err:", err);
        setSchemasError(
          err.response?.data?.error || err.message || "Failed to load schemas"
        );
        setSchemas([]);
        setSelectedSchema(null);
      } finally {
        if (!cancelled) setSchemasLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedProject]);

    useEffect(() => {
      let mounted = true;
      const token = localStorage.getItem("token");
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const loadProjects = async () => {
        setProjectsLoading(true);
        setProjectsError(null);
        try {
          const res = await api.get("/account/project");
          // backend returns: { success: true, projects: [...] }
          const payload = res?.data;
          let list = [];
          if (payload?.success === true && Array.isArray(payload.projects)) {
            list = payload.projects;
          } else if (Array.isArray(payload)) {
            // fallback if backend returns raw array
            list = payload;
          } else if (Array.isArray(payload?.data)) {
            list = payload.data;
          } else {
            // unexpected shape: try to read whatever is useful
            list = payload?.projects || payload?.data || [];
          }

          // normalize each project to UI fields
          const normalized = list.map((p) => ({
            id: p.id,
            name: p.name || "Untitled Project",
            description: p.description || p.plan || "",
            status: p.status || "Active",
            createdAt:
              (p.createdAt &&
                new Date(p.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })) ||
              // fallback to createdAt string or now
              p.createdAt ||
              new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            requests: p.requests ?? "0",
            team: p.team ?? 1,
            raw: p,
          }));

          if (!mounted) return;
          setProjects(normalized);
        } catch (err) {
          console.error("Failed to load projects:", err);
          setProjectsError(
            err?.response?.data || err?.message || "Failed to load projects"
          );
          setProjects([]);
        } finally {
          if (mounted) setProjectsLoading(false);
        }
      };

      loadProjects();

      return () => {
        mounted = false;
      };
    }, []);

  // derived visible list (filter / sort)
  const visibleSchemas = useMemo(() => {
    let list = schemas.slice();
    if (statusFilter !== "All")
      list = list.filter((s) => s.status === statusFilter);
    if (query)
      list = list.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      );
    if (sortBy === "lastUpdated")
      list.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    if (sortBy === "fields")
      list.sort((a, b) => (b.fields || 0) - (a.fields || 0));
    return list;
  }, [schemas, statusFilter, query, sortBy]);

  // create schema POST
  const handleCreateSchema = async (e) => {
    e.preventDefault();
    setCreateError(null);
    if (!selectedProject) return setCreateError("Select a project first");
    if (!createForm.name.trim())
      return setCreateError("Schema name is required");

    setCreating(true);
    try {
      const payload = {
        name: createForm.name.trim(),
        version: createForm.version || "1.0.0",
        description: createForm.description || "",
        fieldsList: [],
      };
      const { data } = await axios.post(
        `/schema/${selectedProject.id}`,
        payload
      );
      // optimistic: add to list and select
      setSchemas((prev) => [data, ...prev]);
      setSelectedSchema(data);
      setShowCreateModal(false);
      setCreateForm({ name: "", version: "1.0.0", description: "" });
    } catch (err) {
      console.error("create schema err:", err);
      setCreateError(
        err.response?.data?.error || err.message || "Failed to create schema"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleExportSelected = () => {
    if (!selectedSchema) return;
    const blob = new Blob([JSON.stringify(selectedSchema, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedSchema.name
      .replace(/\s+/g, "-")
      .toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
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
                <Database className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-white">
                Schema Registry
              </h1>
            </div>
            <p className="text-lg text-gray-400">
              Select a project to view or create schemas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <div className="px-3">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  selectedProject
                    ? "Search schemas..."
                    : "Select a project first"
                }
                disabled={!selectedProject}
                className="bg-transparent px-3 py-2 text-sm placeholder-gray-500 focus:outline-none w-60"
              />
              {query && (
                <button onClick={() => setQuery("")} className="px-2">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm">
              <label className="text-gray-400 text-xs mr-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none text-white text-sm"
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Deprecated">Deprecated</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm">
              <label className="text-gray-400 text-xs mr-2">Sort</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none text-white text-sm"
              >
                <option value="lastUpdated">Last Updated</option>
                <option value="fields">Field Count</option>
              </select>
            </div>

            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold"
            >
              <Plus className="w-5 h-5" /> New Schema
            </Button>
          </div>
        </div>

        {/* Projects selector row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-gray-400">Projects</h3>
              <span className="text-xs text-gray-400">{projects.length}</span>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
              {projectsLoading && (
                <div className="text-gray-400">Loading projects...</div>
              )}
              {projectsError && (
                <div className="text-red-400 text-sm">{projectsError}</div>
              )}

              {projects.map((p) => {
                const active = selectedProject && selectedProject.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${
                      active
                        ? "border-emerald-600 bg-zinc-800"
                        : "border-zinc-800 bg-zinc-900"
                    } hover:border-zinc-700`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {p.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {p.description}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">{p.requests}</div>
                    </div>
                  </button>
                );
              })}

              {!projectsLoading && projects.length === 0 && (
                <div className="text-gray-400 text-sm">No projects found</div>
              )}
            </div>
          </div>

          {/* Schemas list & details */}
          <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="text-sm text-gray-400 mb-1">
                Project:{" "}
                <span className="text-white font-semibold">
                  {selectedProject ? selectedProject.name : "—"}
                </span>
              </div>

              {schemasLoading && (
                <Card className="bg-zinc-900 border border-zinc-800 p-6">
                  <p className="text-gray-400">Loading schemas...</p>
                </Card>
              )}
              {schemasError && (
                <Card className="bg-zinc-900 border border-zinc-800 p-6">
                  <p className="text-red-400">{schemasError}</p>
                </Card>
              )}

              {visibleSchemas.map((schema) => {
                const selected =
                  selectedSchema && selectedSchema.id === schema.id;
                return (
                  <Card
                    key={schema.id}
                    onClick={() => setSelectedSchema(schema)}
                    className={`group bg-zinc-900 border ${
                      selected ? "border-emerald-600" : "border-zinc-800"
                    } hover:border-zinc-700 transition-all cursor-pointer`}
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
                          <p className="text-sm text-white">
                            {schema.lastUpdated}
                          </p>
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
                );
              })}

              {!schemasLoading && visibleSchemas.length === 0 && (
                <Card className="bg-zinc-900 border border-zinc-800 p-6">
                  <p className="text-gray-400">
                    No schemas found for this project
                  </p>
                </Card>
              )}
            </div>

            {/* detail column */}
            <div className="space-y-4">
              <Card className="bg-zinc-900 border border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    {selectedSchema ? selectedSchema.name : "Schema Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!selectedSchema && (
                    <div className="text-gray-400">
                      Select a schema to view details
                    </div>
                  )}
                  {selectedSchema && (
                    <>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Version</p>
                          <p className="text-lg font-semibold text-white">
                            {selectedSchema.version}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {selectedSchema.description}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              selectedSchema.status === "Active"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-gray-500/20 text-gray-300"
                            }`}
                          >
                            {selectedSchema.status}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={handleExportSelected}
                              className="bg-white text-black hover:bg-gray-100 font-semibold px-3 py-1"
                            >
                              <Download className="w-4 h-4" /> Export
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-gray-400 mb-2">Fields</p>
                        <div className="space-y-2">
                          {(selectedSchema.fieldsList || []).map((f, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-zinc-800/50 rounded border border-zinc-700 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-mono text-sm text-white">
                                  {f.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {f.type}
                                </p>
                              </div>
                              {f.required && (
                                <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded">
                                  Required
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-gray-400">
                        <div>
                          Last Updated:{" "}
                          <span className="text-white">
                            {selectedSchema.lastUpdated}
                          </span>
                        </div>
                        <div>
                          Field Count:{" "}
                          <span className="text-white">
                            {selectedSchema.fields}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-sm text-gray-400">
                    Project Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">
                    {projects.length}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Projects loaded</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Create Schema Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setShowCreateModal(false)}
            />
            <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded p-6 z-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Create Schema{" "}
                  {selectedProject ? `in ${selectedProject.name}` : ""}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSchema} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Schema Name *
                  </label>
                  <input
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                    placeholder="My Schema"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Version
                    </label>
                    <input
                      value={createForm.version}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          version: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      defaultValue="Active"
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                    >
                      <option>Active</option>
                      <option>Deprecated</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={createForm.description}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white resize-none"
                    rows={3}
                  />
                </div>

                {createError && (
                  <div className="text-red-400 text-sm">{createError}</div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="bg-white text-black"
                    disabled={creating}
                  >
                    {creating ? "Creating..." : "Create Schema"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SchemasPage;
