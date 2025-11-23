import React, { useEffect, useState } from "react";
import {
  FolderOpen,
  Plus,
  ExternalLink,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import api from "@/api/axios";

export default function NewProjectPage() {
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

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

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const payload = {
      name: formData.name.trim(),
      description: formData.description || "",
    };

    try {
      const res = await api.post("/account/project", payload, { headers });

      // backend returns { success: true, projectId: <uuid> }
      const data = res?.data;
      let newId = null;
      if (data?.projectId) newId = data.projectId;
      else if (data?.id) newId = data.id;
      else if (data?.success && data?.project) newId = data.project.id;
      // fallback to generated client id (not ideal but prevents crash)
      if (!newId) newId = `temp-${Date.now()}`;

      const now = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const newProject = {
        id: newId,
        name: payload.name,
        description: payload.description,
        status: "Active",
        createdAt: now,
        requests: "0",
        team: 1,
      };

      setProjects((prev) => [newProject, ...prev]);
      setFormData({ name: "", description: "" });
      setShowCreateForm(false);
    } catch (err) {
      console.error("Error creating project:", err);
      alert(
        `Failed to create project: ${
          err?.response?.data?.error || err?.message || "Unknown error"
        }`
      );
    }
  };

  const handleDeleteProject = (id) => {
    // frontend-only delete for now (no backend delete route provided)
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 rounded-lg">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-white">
                Projects
              </h1>
            </div>
            <p className="text-lg text-gray-400">
              Manage and organize your projects
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-white text-black hover:bg-gray-100 font-semibold rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        </div>

        {showCreateForm && (
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-white">Create New Project</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter project name"
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter project description"
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="bg-white text-black hover:bg-gray-100 font-semibold rounded-lg"
                  >
                    Create Project
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {projectsLoading && (
          <div className="text-gray-400">Loading projects...</div>
        )}
        {projectsError && <div className="text-red-400">{projectsError}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all hover:shadow-lg group cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-gray-100 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {project.description}
                      </p>
                    </div>
                    <button className="p-2 text-gray-400 hover:bg-zinc-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        project.status === "Active"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-800">
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm font-semibold text-white">
                        {project.createdAt}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Requests</p>
                      <p className="text-sm font-semibold text-white">
                        {project.requests}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Team</p>
                      <p className="text-sm font-semibold text-white">
                        {project.team}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-sm font-medium rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && !projectsLoading && (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              No projects yet
            </h2>
            <p className="text-gray-400 mb-6">
              Create your first project to get started
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-black hover:bg-gray-100 font-semibold rounded-lg inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
