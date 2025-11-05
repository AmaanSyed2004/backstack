"use client";

import { BookOpen, Search, ExternalLink, Code2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";

const docSections = [
  {
    title: "Getting Started",
    items: [
      { name: "Installation", href: "#" },
      { name: "Quick Start", href: "#" },
      { name: "Configuration", href: "#" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { name: "Authentication", href: "#" },
      { name: "Endpoints", href: "#" },
      { name: "Error Handling", href: "#" },
    ],
  },
  {
    title: "Guides",
    items: [
      { name: "Building APIs", href: "#" },
      { name: "Database Integration", href: "#" },
      { name: "Deployment", href: "#" },
    ],
  },
];

const codeExamples = [
  {
    title: "Authentication",
    language: "JavaScript",
    code: `const auth = new AuthService({
  apiKey: 'your-api-key',
  endpoint: 'https://api.example.com'
});

await auth.login(email, password);`,
  },
  {
    title: "Create Record",
    language: "Python",
    code: `from crud_service import CRUDClient

client = CRUDClient(api_key='your-key')
result = client.create('users', {
  'name': 'John Doe',
  'email': 'john@example.com'
})`,
  },
];

const DocsPage = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white">
              Documentation
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Complete guides and API reference
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search documentation..."
              className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navigation */}
          <div className="space-y-4">
            {docSections.map((section, idx) => (
              <Card key={idx} className="bg-zinc-900 border border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-sm text-white">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <a
                      key={itemIdx}
                      href={item.href}
                      className="flex items-center justify-between p-2 rounded hover:bg-zinc-800 transition-colors group"
                    >
                      <span className="text-sm text-gray-300 group-hover:text-white">
                        {item.name}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                    </a>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-6">
            {codeExamples.map((example, idx) => (
              <Card key={idx} className="bg-zinc-900 border border-zinc-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">
                      {example.title}
                    </CardTitle>
                    <span className="text-xs px-2 py-1 bg-zinc-800 text-gray-300 rounded font-mono">
                      {example.language}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-black rounded border border-zinc-800 p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  API Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    method: "POST",
                    path: "/api/auth/login",
                    desc: "User login",
                  },
                  {
                    method: "GET",
                    path: "/api/users/:id",
                    desc: "Get user by ID",
                  },
                  {
                    method: "PUT",
                    path: "/api/users/:id",
                    desc: "Update user",
                  },
                  {
                    method: "DELETE",
                    path: "/api/users/:id",
                    desc: "Delete user",
                  },
                ].map((endpoint, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-800/50 rounded border border-zinc-700"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 text-xs font-mono font-bold bg-white text-black rounded">
                        {endpoint.method}
                      </span>
                      <code className="text-sm text-gray-300 font-mono">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="text-xs text-gray-400">{endpoint.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocsPage;
