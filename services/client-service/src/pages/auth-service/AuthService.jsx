import React, { useEffect, useState } from "react";
import { Folder, Users, ChevronRight, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import api from "@/api/axios";

export default function AuthService() {
  // --- STATE (From Dynamic Code) ---
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // --- LOGIC (From Dynamic Code) ---

  // Inject token into axios
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []);

  // Load all projects
  useEffect(() => {
    const load = async () => {
      setProjectsLoading(true);
      try {
        const res = await api.get("/account/project");
        const data = res.data.projects || res.data || [];
        setProjects(data);
        if (data.length > 0) setSelectedProject(data[0]);
      } catch (err) {
        setProjectsError("Failed to load projects");
      } finally {
        setProjectsLoading(false);
      }
    };
    load();
  }, []);

  // Load users when project changes
  useEffect(() => {
    if (!selectedProject) return;

    const loadUsers = async () => {
      setUsersLoading(true);
      try {
        const res = await api.get(`/account/data/users/${selectedProject.id}`);
        setUsers(res.data || []);
      } catch (err) {
        setUsersError("Failed to load users");
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, [selectedProject]);

  // --- UI (From Static Code) ---
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Auth Service</h1>
          </div>
          <p className="text-gray-400">Manage projects and end users</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PROJECTS COLUMN */}
          <div>
            <Card className="bg-zinc-900 border border-zinc-800 h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Folder className="w-5 h-5 text-gray-400" />
                  <CardTitle className="text-lg text-gray-400">
                    Projects
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 flex-1 overflow-y-auto">
                {/* Loading / Error States */}
                {projectsLoading && (
                  <p className="text-sm text-gray-400">Loading projects...</p>
                )}
                {projectsError && (
                  <p className="text-sm text-red-400">{projectsError}</p>
                )}

                {/* Projects List */}
                {projects.map((p) => {
                  const active = p.id === selectedProject?.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProject(p)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        active
                          ? "border-white bg-white/10 shadow-lg"
                          : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {p.description || "No description"}
                          </p>
                        </div>
                        {active && (
                          <ChevronRight className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* END USERS COLUMN */}
          <div>
            <Card className="bg-zinc-900 border border-zinc-800 h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <CardTitle className="text-lg text-gray-400">
                      End Users
                    </CardTitle>
                  </div>
                  {/* User Count Badge */}
                  {selectedProject && users.length > 0 && !usersLoading && (
                    <span className="text-sm font-semibold text-gray-300 bg-zinc-800 px-2.5 py-1 rounded">
                      {users.length}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                {!selectedProject && !projectsLoading && (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p className="text-sm">Select a project to view users</p>
                  </div>
                )}

                {/* Loading / Error States */}
                {usersLoading && (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <p className="text-sm">Loading users...</p>
                  </div>
                )}
                {usersError && (
                  <p className="text-sm text-red-400">{usersError}</p>
                )}

                {/* Empty State */}
                {selectedProject &&
                  !usersLoading &&
                  users.length === 0 &&
                  !usersError && (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p className="text-sm">No users for this project</p>
                    </div>
                  )}

                {/* Users List */}
                {selectedProject && !usersLoading && users.length > 0 && (
                  <div className="space-y-2">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-semibold text-white truncate">
                            {u.email}
                          </p>
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2 py-0.5 bg-zinc-700/50 rounded text-xs font-medium text-gray-300">
                            {u.role || "user"}
                          </span>
                          <p className="text-xs text-gray-500 font-mono truncate">
                            {u.id}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
