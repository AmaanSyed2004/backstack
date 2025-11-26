// SchemaRegistryPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Database,
  Plus,
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

const dataTypes = [
  "String",
  "Integer",
  "Decimal",
  "UUID",
  "Timestamp",
  "JSON",
  "Boolean",
  "Array",
];

export default function SchemaRegistryPage() {
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
  const [selectedSchema, setSelectedSchema] = useState(null);

  // Create schema modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    version: "1.0.0",
    description: "",
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Fields builder (create-time)
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({
    name: "",
    type: "String",
    required: false,
    description: "",
  });

  // ensure auth header (api.interceptor may already do it)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
  }, []);

  // Load projects
  useEffect(() => {
    let mounted = true;
    const loadProjects = async () => {
      setProjectsLoading(true);
      setProjectsError(null);
      try {
        const res = await api.get("/account/project");
        const payload = res?.data;
        let list = [];

        if (payload?.success === true && Array.isArray(payload.projects)) {
          list = payload.projects;
        } else if (Array.isArray(payload)) {
          list = payload;
        } else if (Array.isArray(payload?.data)) {
          list = payload.data;
        } else {
          list = payload?.projects || payload?.data || [];
        }

        const normalized = list.map((p) => ({
          id: p.id,
          name: p.name || "Untitled Project",
          description: p.description || p.plan || "",
          requests: p.requests ?? "0",
          raw: p,
        }));

        if (!mounted) return;
        setProjects(normalized);

        // default select first
        if (!selectedProject && normalized.length > 0) {
          setSelectedProject(normalized[0]);
        } else if (selectedProject) {
          const found = normalized.find((x) => x.id === selectedProject.id);
          if (found) setSelectedProject(found);
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load schemas for selected project
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
        const res = await api.get(`/schema/${selectedProject.id}`);
        const data = res?.data;
        // adapt controller return shapes:
        const list = Array.isArray(data)
          ? data
          : data?.collections || data?.schemas || data?.data || [];
        if (cancelled) return;
        const normalized = list.map((c) => {
          const fieldsCount =
            (c.schemaJson && Array.isArray(c.schemaJson.fields)
              ? c.schemaJson.fields.length
              : Array.isArray(c.fields)
              ? c.fields.length
              : c.fields ?? 0) || 0;
          return { ...c, fields: fieldsCount };
        });
        setSchemas(normalized);
        setSelectedSchema(normalized.length ? normalized[0] : null);
      } catch (err) {
        console.error("load schemas err:", err);
        setSchemasError(
          err?.response?.data?.error || err?.message || "Failed to load schemas"
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

  // derived visible list (search)
  const visibleSchemas = useMemo(() => {
    let list = Array.isArray(schemas) ? schemas.slice() : [];
    if (query)
      list = list.filter((s) =>
        (s.name || "").toLowerCase().includes(query.toLowerCase())
      );
    return list;
  }, [schemas, query]);

  // Map your UI types -> JSON Schema types
  const uiToJsonType = (t) => {
    switch (t) {
      case "String":
      case "UUID":
      case "Timestamp":
        return "string";
      case "Integer":
        return "integer";
      case "Decimal":
        return "number";
      case "Boolean":
        return "boolean";
      case "JSON":
        return "object";
      case "Array":
        return "array";
      default:
        return "string";
    }
  };

  // slug helper
  const slugify = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // Build the exact schema JSON object per your example
  const buildSchemaJsonObject = (collectionName, fieldsArray) => {
    const idSlug =
      slugify(collectionName) || `schema-${Date.now().toString(36)}`;
    const properties = {};
    const required = [];

    (fieldsArray || []).forEach((f) => {
      if (!f.name) return;
      properties[f.name] = { type: uiToJsonType(f.type) };
      // optional: include any extra metadata (we only set type to match your sample)
      if (f.required) required.push(f.name);
    });

    const schemaObj = {
      $id: `https://backstack.dev/schemas/${idSlug}`,
      type: "object",
      properties,
    };

    if (required.length > 0) schemaObj.required = required;

    return schemaObj;
  };

  // Create schema handler (sends { name, fields: <schemaObject> } exactly as you requested)
  const handleCreateSchema = async (e) => {
    e?.preventDefault?.();
    setCreateError(null);
    if (!selectedProject) return setCreateError("Select a project first");
    if (!createForm.name.trim())
      return setCreateError("Schema name is required");

    if (!Array.isArray(fields) || fields.length === 0)
      return setCreateError(
        "Add at least one field before creating the schema"
      );

    setCreating(true);
    try {
      const schemaJsonObj = buildSchemaJsonObject(
        createForm.name.trim(),
        fields
      );

      const payload = {
        name: createForm.name.trim(),
        fields: schemaJsonObj, // EXACT shape requested
      };

      // POST to the endpoint you specified — unchanged
      const res = await api.post(`/schema/${selectedProject.id}`, payload);

      // controller may return { collection } or direct object
      const created = res?.data?.collection || res?.data || null;

      const toAdd = created || {
        id: Math.random().toString(36).slice(2),
        projectId: selectedProject.id,
        name: payload.name,
        schemaJson: payload.fields,
        version: createForm.version,
        description: createForm.description,
        status: "Active",
        lastUpdated: new Date().toISOString().split("T")[0],
        fields: Object.keys(payload.fields.properties || {}).length,
      };

      // normalize
      if (
        created &&
        created.schemaJson &&
        Array.isArray(created.schemaJson.fields)
      ) {
        created.fields = created.schemaJson.fields.length;
      } else if (
        created &&
        created.schemaJson &&
        created.schemaJson.properties
      ) {
        created.fields = Object.keys(created.schemaJson.properties).length;
      }

      setSchemas((prev) => [toAdd, ...(prev || [])]);
      setSelectedSchema(toAdd);

      // reset
      setShowCreateModal(false);
      setCreateForm({ name: "", version: "1.0.0", description: "" });
      setFields([]);
      setNewField({
        name: "",
        type: "String",
        required: false,
        description: "",
      });
    } catch (err) {
      console.error("create schema err:", err);
      setCreateError(
        err?.response?.data?.error || err?.message || "Failed to create schema"
      );
    } finally {
      setCreating(false);
    }
  };

  // Delete schema
  const handleDeleteSchema = async (schema) => {
    if (!schema) return;
    if (!confirm(`Delete schema "${schema.name}"?`)) return;
    try {
      await api.delete(`/schema/${selectedProject.id}/${schema.id}`);
      setSchemas((prev) => (prev || []).filter((s) => s.id !== schema.id));
      if (selectedSchema?.id === schema.id) setSelectedSchema(null);
    } catch (err) {
      console.error("delete schema err:", err);
      alert(
        err?.response?.data?.error || err?.message || "Failed to delete schema"
      );
    }
  };

  // helper: format date
  const formatDate = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toISOString().split("T")[0];
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

            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-semibold"
            >
              <Plus className="w-5 h-5" /> New Schema
            </Button>
          </div>
        </div>

        {/* Projects + Schemas */}
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
                    onClick={() => {
                      setSelectedProject(p);
                      setSelectedSchema(null);
                    }}
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

              {(visibleSchemas || []).map((schema) => {
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
                            Version {schema.version || "—"}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            schema.status === "Active"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-gray-500/20 text-gray-300"
                          }`}
                        >
                          {schema.status || "Active"}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-zinc-800/50 rounded border border-zinc-700">
                        <div>
                          <p className="text-xs text-gray-400">Fields</p>
                          <p className="text-lg font-semibold text-white">
                            {schema.fields ??
                              schema.schemaJson?.properties?.length ??
                              0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Last Updated</p>
                          <p className="text-sm text-white">
                            {formatDate(schema.lastUpdated)}
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 hover:bg-zinc-700 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(
                                JSON.stringify(schema, null, 2)
                              );
                            }}
                          >
                            <Copy className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            className="p-2 hover:bg-zinc-700 rounded transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSchema(schema);
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {!schemasLoading &&
                (!visibleSchemas || visibleSchemas.length === 0) && (
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
                            {selectedSchema.version || "—"}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {selectedSchema.description || ""}
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
                            {selectedSchema.status || "Active"}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => {
                                const blob = new Blob(
                                  [JSON.stringify(selectedSchema, null, 2)],
                                  { type: "application/json" }
                                );
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `${(
                                  selectedSchema.name || "schema"
                                )
                                  .replace(/\s+/g, "-")
                                  .toLowerCase()}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
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
                          {Object.entries(
                            selectedSchema.schemaJson?.properties || {}
                          ).map(([k, v], idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-zinc-800/50 rounded border border-zinc-700 flex items-center justify-between"
                            >
                              <div>
                                <p className="font-mono text-sm text-white">
                                  {k}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {v.type}
                                </p>
                              </div>
                              {(
                                selectedSchema.schemaJson?.required || []
                              ).includes(k) && (
                                <span className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded">
                                  Required
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3">
                          <p className="mt-2 text-xs text-gray-500">
                            Collections are created with fields at creation time
                            only.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-gray-400">
                        <div>
                          Last Updated:{" "}
                          <span className="text-white">
                            {formatDate(selectedSchema.lastUpdated)}
                          </span>
                        </div>
                        <div>
                          Field Count:{" "}
                          <span className="text-white">
                            {selectedSchema.fields ??
                              Object.keys(
                                selectedSchema.schemaJson?.properties || {}
                              ).length}
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
                    placeholder="Bookshelf"
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
                      Description
                    </label>
                    <input
                      value={createForm.description}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white"
                    />
                  </div>
                </div>

                {/* Fields builder */}
                <div className="p-4 border border-zinc-700 rounded bg-zinc-800">
                  <h4 className="text-white font-semibold mb-3">
                    Fields (add at least one)
                  </h4>

                  {fields.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 bg-zinc-900 border border-zinc-700 rounded mb-2"
                    >
                      <div className="flex-1">
                        <p className="text-white text-sm">{f.name}</p>
                        <p className="text-gray-400 text-xs">
                          {f.type} {f.required ? "• required" : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFields(fields.filter((_, i) => i !== idx))
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      placeholder="field name"
                      value={newField.name}
                      onChange={(e) =>
                        setNewField({ ...newField, name: e.target.value })
                      }
                      className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white col-span-1 md:col-span-1"
                    />
                    <select
                      value={newField.type}
                      onChange={(e) =>
                        setNewField({ ...newField, type: e.target.value })
                      }
                      className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white col-span-1 md:col-span-1"
                    >
                      {dataTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newField.required}
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            required: e.target.checked,
                          })
                        }
                        className="w-4 h-4 bg-zinc-800 border border-zinc-700 rounded accent-emerald-500"
                      />
                      <label className="text-sm text-gray-400">Required</label>
                      <div className="flex-1" />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newField.name.trim()) return;
                          setFields([
                            ...fields,
                            {
                              name: newField.name.trim(),
                              type: newField.type,
                              required: !!newField.required,
                              description: newField.description || "",
                            },
                          ]);
                          setNewField({
                            name: "",
                            type: "String",
                            required: false,
                            description: "",
                          });
                        }}
                        className="ml-auto bg-white text-black font-semibold px-3 py-2 rounded"
                      >
                        Add Field
                      </button>
                    </div>

                    <textarea
                      value={newField.description}
                      onChange={(e) =>
                        setNewField({
                          ...newField,
                          description: e.target.value,
                        })
                      }
                      placeholder="field description (optional)"
                      className="col-span-1 md:col-span-3 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white"
                    />
                  </div>
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
}
