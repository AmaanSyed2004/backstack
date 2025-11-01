import { Plus, Folder, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/sidebar";

const mockProjects = [
  {
    id: 1,
    name: "Design System",
    description:
      "Comprehensive design system with components, tokens, and documentation for consistent UI across all products.",
    status: "Active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Mobile App",
    description:
      "Native mobile application for iOS and Android with real-time synchronization and offline support.",
    status: "Development",
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    name: "Analytics Dashboard",
    description:
      "Advanced analytics platform providing real-time insights and comprehensive reporting capabilities.",
    status: "Active",
    createdAt: "2024-03-10",
  },
  {
    id: 4,
    name: "API Gateway",
    description:
      "Scalable API infrastructure with authentication, rate limiting, and comprehensive monitoring.",
    status: "Archived",
    createdAt: "2024-01-05",
  },
  {
    id: 5,
    name: "Content Management",
    description:
      "Headless CMS platform for managing digital content across multiple channels and platforms.",
    status: "Active",
    createdAt: "2024-02-28",
  },
  {
    id: 6,
    name: "Machine Learning Pipeline",
    description:
      "End-to-end ML pipeline for data processing, model training, and deployment automation.",
    status: "Development",
    createdAt: "2024-03-05",
  },
];

export default function ProjectsPage() {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight text-white">
              Projects
            </h1>
            <p className="text-lg text-gray-400">
              Manage and explore all your active projects
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold transition-colors">
            <Plus className="w-5 h-5" />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Card
              key={project.id}
              className="group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-2xl hover:shadow-white/5 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardHeader className="relative z-10 flex flex-row items-start justify-between pb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-zinc-800 group-hover:bg-zinc-700 rounded-lg transition-colors">
                    <Folder className="w-5 h-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-semibold text-white group-hover:text-white transition-colors">
                      {project.name}
                    </CardTitle>
                  </div>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                    project.status === "Active"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : project.status === "Development"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-gray-500/20 text-gray-300 border border-gray-500/30"
                  }`}
                >
                  {project.status}
                </span>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4">
                <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <p className="text-xs text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 bg-zinc-900 rounded-2xl mb-6">
              <Folder className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              No Projects Found
            </h2>
            <p className="text-gray-400 mb-8 max-w-sm">
              Start by creating your first project to get started
            </p>
            <Button className="bg-white hover:bg-gray-100 text-black font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Project
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
