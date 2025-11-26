"use client";

import { useState } from "react";
import { BookOpen, Search, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";

const sections = [
  {
    id: "intro",
    title: "Introduction",
    content:
      "Backstack is a plug-and-play Backend-as-a-Service platform with no SDK installation required. All requests use REST API with JWT authentication.",
  },
  {
    id: "auth",
    title: "Authentication",
    endpoints: [
      {
        method: "POST",
        path: "/auth/signup",
        title: "Sign Up",
        description: "Create a new user account",
        body: {
          name: "string",
          email: "string",
          password: "string",
        },
        examples: [
          {
            lang: "JavaScript (axios)",
            code: `import axios from 'axios';

const signup = async () => {
  try {
    const response = await axios.post('http://localhost:8000/auth/signup', {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('User created:', response.data);
  } catch (error) {
    console.error('Signup error:', error.response.data);
  }
};`,
          },
          {
            lang: "Fetch API",
            code: `const signup = async () => {
  try {
    const response = await fetch('http://localhost:8000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123'
      })
    });
    const data = await response.json();
    console.log('User created:', data);
  } catch (error) {
    console.error('Signup error:', error);
  }
};`,
          },
          {
            lang: "curl",
            code: `curl -X POST http://localhost:8000/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'`,
          },
        ],
        response: {
          success: {
            code: 201,
            body: {
              id: "uuid",
              name: "John Doe",
              email: "john@example.com",
              token: "jwt-token",
            },
          },
          error: {
            code: 400,
            body: {
              error: "VALIDATION_ERROR",
              message: "Email already exists",
            },
          },
        },
      },
      {
        method: "POST",
        path: "/auth/login",
        title: "Login",
        description: "Authenticate and get JWT token",
        body: {
          email: "string",
          password: "string",
        },
        examples: [
          {
            lang: "JavaScript (axios)",
            code: `const login = async () => {
  try {
    const response = await axios.post('http://localhost:8000/auth/login', {
      email: 'john@example.com',
      password: 'SecurePass123'
    });
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    console.log('Login successful');
  } catch (error) {
    console.error('Login failed:', error.response.data.message);
  }
};`,
          },
          {
            lang: "Fetch API",
            code: `const login = async () => {
  const response = await fetch('http://localhost:8000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'john@example.com',
      password: 'SecurePass123'
    })
  });
  const { token } = await response.json();
  localStorage.setItem('authToken', token);
};`,
          },
          {
            lang: "curl",
            code: `curl -X POST http://localhost:8000/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'`,
          },
        ],
        response: {
          success: {
            code: 200,
            body: {
              token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              user: { id: "uuid", name: "John Doe", email: "john@example.com" },
            },
          },
        },
      },
      {
        method: "GET",
        path: "/auth/verify",
        title: "Verify Auth Token",
        description:
          "Checks if the provided JWT token is valid and belongs to the correct project. Returns success: true if valid.",
        examples: [
          {
            lang: "JavaScript (axios)",
            code: `const verifyAuth = async () => {
  const token = localStorage.getItem('authToken');
  const projectId = localStorage.getItem('projectId'); // or your config

  try {
    const response = await axios.get('http://localhost:8000/auth/verify', {
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'x-project-id': projectId
      }
    });

    console.log('Token valid:', response.data); 
    // { success: true }
  } catch (error) {
    console.error('Verification failed:', error.response?.data);
  }
};`,
          },
          {
            lang: "curl",
            code: `curl -X GET http://localhost:8000/account/auth/verify \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "x-project-id: YOUR_PROJECT_ID"`,
          },
        ],
      },
      {
        method: "POST",
        path: "/auth/logout",
        title: "Logout",
        description: "Invalidate current session",
        examples: [
          {
            lang: "JavaScript (axios)",
            code: `const logout = async () => {
  const token = localStorage.getItem('authToken');
  await axios.post('http://localhost:8000/auth/logout', {}, {
    headers: { 'Authorization': \`Bearer \${token}\` }
  });
  localStorage.removeItem('authToken');
  console.log('Logged out successfully');
};`,
          },
        ],
      },
    ],
  },
  {
    id: "schema",
    title: "Schema Management",
    endpoints: [
      {
        method: "POST",
        path: "/schema/:projectId",
        title: "Create Schema",
        description:
          "Create a new data collection schema for a specific project. Requires valid JWT and project ID.",
        pathParams: [
          {
            name: "projectId",
            type: "string",
            description: "Unique project identifier",
          },
        ],
        body: {
          collectionName: "string",
          fields: [
            {
              fieldName: "string",
              type: "String | Integer | UUID | Boolean | Date",
              required: "boolean",
              default: "any",
            },
          ],
        },
        examples: [
          {
            lang: "JavaScript (axios)",
            code: `const createSchema = async () => {
  const token = localStorage.getItem('authToken');
  const projectId = localStorage.getItem('projectId'); // or however you store it

  const response = await axios.post(
    \`http://localhost:8000/schema/\${projectId}\`,
    {
      collectionName: 'users',
      fields: [
        { fieldName: 'id', type: 'UUID', required: true },
        { fieldName: 'name', type: 'String', required: true },
        { fieldName: 'email', type: 'String', required: true },
        { fieldName: 'age', type: 'Integer', required: false },
        { fieldName: 'createdAt', type: 'Date', required: true }
      ]
    },
    {
      headers: {
        'Authorization': \`Bearer \${token}\`,
        'Content-Type': 'application/json'
      }
    }
  );

  console.log('Schema created:', response.data);
};`,
          },
          {
            lang: "curl",
            code: `curl -X POST http://localhost:8000/schema/YOUR_PROJECT_ID \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "collectionName": "users",
    "fields": [
      { "fieldName": "id", "type": "UUID", "required": true },
      { "fieldName": "name", "type": "String", "required": true },
      { "fieldName": "email", "type": "String", "required": true }
    ]
  }'`,
          },
        ],
        response: {
          success: {
            code: 201,
            body: {
              id: "uuid",
              name: "John Doe",
              email: "john@example.com",
              token: "jwt-token",
            },
          },
          error: {
            code: 400,
            body: {
              error: "INVALID",
              message:
                "Collection with this name already exists for the project",
            },
          },
        },
      },
      {
        method: "GET",
        path: "/schema/:projectId",
        title: "List All Schemas",
        description: "Get all collection schemas for user",
        examples: [
          {
            lang: "JavaScript (axios)",
            code: `const listSchemas = async () => {
  const token = localStorage.getItem('authToken');
  const response = await axios.get(
    'http://localhost:8000/schema/list',
    {
      headers: { 'Authorization': \`Bearer \${token}\` }
    }
  );
  console.log('All schemas:', response.data);
};`,
          },
        ],
      },
      {
        method: "GET",
        path: "/schema/:projectId/:collectionId",
        title: "Get Collection By ID",
        description:
          "Fetch a specific collection schema by its collection ID within a project.",
        headers: {
          Authorization: "Bearer <jwt-token>",
        },
        params: {
          projectId: "string",
          collectionId: "string",
        },
        response: {
          success: {
            code: 200,
            body: {
              collection: {
                id: "uuid",
                name: "Users",
                fields: [
                  {
                    id: "uuid",
                    name: "email",
                    type: "String",
                    required: true,
                    unique: true,
                  },
                  {
                    id: "uuid",
                    name: "age",
                    type: "Integer",
                    required: false,
                  },
                ],
                createdAt: "2025-01-01T10:30:00.000Z",
                updatedAt: "2025-01-05T12:45:00.000Z",
              },
            },
          },
          error: {
            code: 400,
            body: {
              error: "INVALID_PATH_PARAMS",
              message: "projectId or collectionId is invalid",
            },
          },
        },
        examples: [
          {
            lang: "JavaScript (axios)",
            code: `const getCollectionById = async () => {
  const token = localStorage.getItem("authToken");
  const response = await axios.get(
    \`\${base_url}/schema/\${projectId}/\${collectionId}\`,
    {
      headers: { Authorization: \`Bearer \${token}\` }
    }
  );
  console.log("Collection:", response.data);
};`,
          },
          {
            lang: "curl",
            code: `curl -X GET {{base_url}}/schema/{{project_id}}/{{collection_id}} \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
          },
        ],
      },
      {
        method: "DELETE",
        path: "/schema/:projectId/:collectionId",
        title: "Delete Collection",
        description:
          "Delete a collection schema from a project by its collection ID.",
        headers: {
          Authorization: "Bearer <jwt-token>",
        },
        params: {
          projectId: "string",
          collectionId: "string",
        },
        examples: [
          {
            lang: "JavaScript (axios)",
            code: `const deleteCollection = async () => {
  const token = localStorage.getItem("authToken");
  const response = await axios.delete(
    \`\${base_url}/schema/\${projectId}/\${collectionId}\`,
    {
      headers: { Authorization: \`Bearer \${token}\` }
    }
  );
  console.log("Deleted:", response.data);
};`,
          },
          {
            lang: "curl",
            code: `curl -X DELETE {{base_url}}/schema/{{project_id}}/{{collection_id}} \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
          },
        ],
        response: {
          success: {
            code: 200,
            body: {
              message: "Collection deleted successfully",
            },
          },
          error: {
            code: 404,
            body: {
              error: "NOT_FOUND",
              message: "Collection not found",
            },
          },
        },
      },
    ],
  },
  {
    id: "crud",
    title: "CRUD Operations",
    endpoints: [
      {
        method: "POST",
        path: "/crud/:project_id/:collection_id",
        title: "Create Document",
        description: "Insert a new document into the specified collection",
        body: {
          fieldName: "value",
        },
        examples: [
          {
            lang: "JavaScript (axios)",
            code: `const createDocument = async () => {
  const token = localStorage.getItem('authToken');
  const projectId = "YOUR_PROJECT_ID";
  const collectionId = "YOUR_COLLECTION_ID";

  const res = await axios.post(
    \`http://localhost:8000/crud/\${PROJECT_ID}/\${COLLECTION_ID}\`,
    {
      name: "John Doe",
      email: "john@example.com",
      age: 25
    },
    {
      headers: { 
        "Authorization": \`Bearer \${token}\`,
        "Content-Type": "application/json"
      }
    }
  );

  console.log("Document created:", res.data);
};`,
          },
          {
            lang: "curl",
            code: `curl -X POST http://localhost:8000/crud/PROJECT_ID/COLLECTION_ID \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'`,
          },
        ],

        response: {
          success: {
            code: 201,
          },
          error: {
            code: 400,
            body: {
              error: "VALIDATION_ERROR",
              message: "Invalid document data",
            },
          },
        },
      },
      {
        method: "GET",
        path: "/crud/:project_id/:collection_id/:id",
        title: "Get Document by ID",
        description: "Fetch a single document from a collection using its ID",

        examples: [
          {
            lang: "JavaScript (axios)",
            code: `const getDocumentById = async () => {
  const token = localStorage.getItem('authToken');

  const res = await axios.get(
    'http://localhost:8000/crud/PROJECT_ID/COLLECTION_ID/DOCUMENT_ID',
    {
      headers: {
        Authorization: \`Bearer \${token}\`
      }
    }
  );

  console.log("Document:", res.data);
};`,
          },
          {
            lang: "curl",
            code: `curl -X GET http://localhost:8000/crud/PROJECT_ID/COLLECTION_ID/DOCUMENT_ID \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
          },
        ],

        response: {
          success: {
            code: 200,
            body: {
              id: "uuid",
            },
          },
          error: {
            code: 404,
            body: {
              error: "NOT_FOUND",
              message: "Document not found",
            },
          },
        },
      },
      {
        method: "GET",
        path: "/crud/:project_id/:collection_id/:id",
        title: "Get Document by ID",
        description: "Fetch a single document from a collection using its ID",

        examples: [
          {
            lang: "JavaScript (axios)",
            code: `const getDocumentById = async () => {
  const token = localStorage.getItem('authToken');

  const res = await axios.get(
    'http://localhost:8000/crud/PROJECT_ID/COLLECTION_ID/DOCUMENT_ID',
    {
      headers: {
        Authorization: \`Bearer \${token}\`
      }
    }
  );

  console.log("Document:", res.data);
};`,
          },
          {
            lang: "curl",
            code: `curl -X GET http://localhost:8000/crud/PROJECT_ID/COLLECTION_ID/DOCUMENT_ID \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
          },
        ],

        response: {
          success: {
            code: 200,
            body: {
              id: "uuid",
            },
          },
          error: {
            code: 404,
            body: {
              error: "NOT_FOUND",
              message: "Document not found",
            },
          },
        },
      },
      {
        method: "PATCH",
        path: "/crud/:project_id/:collection_id/:id",
        title: "Update Document",
        description: "Update an existing document by its ID",
        body: {
          field1: "new value",
          field2: "new value",
        },

        examples: [
          {
            lang: "JavaScript (axios)",
            code: `const updateDocument = async () => {
  const token = localStorage.getItem('authToken');

  const res = await axios.put(
    'http://localhost:8000/crud/PROJECT_ID/COLLECTION_ID/DOCUMENT_ID',
    {
      field1: "updated value",
      field2: "updated value"
    },
    {
      headers: { Authorization: \`Bearer \${token}\` }
    }
  );

  console.log("Updated Document:", res.data);
};`,
          },
          {
            lang: "curl",
            code: `curl -X PUT http://localhost:8000/crud/PROJECT_ID/COLLECTION_ID/DOCUMENT_ID \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "field1": "updated value",
    "field2": "updated value"
  }'`,
          },
        ],

        response: {
          success: {
            code: 200,
            body: {
              id: "uuid",
            },
          },
          error: {
            code: 404,
            body: {
              error: "NOT_FOUND",
              message: "Document not found",
            },
          },
        },
      },
      {
        method: "DELETE",
        path: "/crud/:project_id/:collection_id/:id",
        title: "Delete Document",
        description: "Delete a document by its ID",

        examples: [
          {
            lang: "JavaScript (axios)",
            code: `const deleteDocument = async () => {
  const token = localStorage.getItem('authToken');

  const res = await axios.delete(
    'http://localhost:8000/crud/PROJECT_ID/COLLECTION_ID/DOCUMENT_ID',
    {
      headers: { Authorization: \`Bearer \${token}\` }
    }
  );

  console.log("Deleted Document:", res.data);
};`,
          },
          {
            lang: "curl",
            code: `curl -X DELETE http://localhost:8000/crud/PROJECT_ID/COLLECTION_ID/DOCUMENT_ID \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`,
          },
        ],

        response: {
          success: {
            code: 200,
            body: {
              success: true,
              message: "Document deleted successfully",
            },
          },
          error: {
            code: 404,
            body: {
              error: "NOT_FOUND",
              message: "Document not found",
            },
          },
        },
      },
    ],
  },
  {
    id: "usecases",
    title: "Common Use Cases",
    content: "Ready-to-use code snippets for common scenarios",
  },
];

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-black rounded border border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-zinc-800">
        <span className="text-xs font-mono text-gray-400">{language}</span>
        <button
          onClick={handleCopy}
          className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
          {code}
        </code>
      </pre>
    </div>
  );
};

const EndpointCard = ({ endpoint }) => {
  const [expanded, setExpanded] = useState(false);

  const methodColors = {
    POST: "bg-blue-900 text-blue-200",
    GET: "bg-green-900 text-green-200",
    PATCH: "bg-yellow-900 text-yellow-200",
    DELETE: "bg-red-900 text-red-200",
  };

  return (
    <Card className="bg-zinc-900 border border-zinc-800">
      <CardHeader
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-bold rounded ${
              methodColors[endpoint.method]
            }`}
          >
            {endpoint.method}
          </span>
          <div>
            <CardTitle className="text-white text-base">
              {endpoint.title}
            </CardTitle>
            <p className="text-xs text-gray-400 mt-1">{endpoint.description}</p>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4 border-t border-zinc-800 pt-4">
          <div>
            <code className="text-sm font-mono text-gray-300 block bg-black px-4 py-2 rounded border border-zinc-800">
              {endpoint.path}
            </code>
          </div>

          {endpoint.body && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">
                Request Body
              </h4>
              <pre className="text-xs text-gray-300 bg-black p-3 rounded border border-zinc-800 overflow-x-auto">
                <code>{JSON.stringify(endpoint.body, null, 2)}</code>
              </pre>
            </div>
          )}

          {endpoint.examples && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">
                Examples
              </h4>
              <div className="space-y-3">
                {endpoint.examples.map((example, idx) => (
                  <div key={idx}>
                    <CodeBlock code={example.code} language={example.lang} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {endpoint.response && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">Responses</h4>
              {endpoint.response.success && (
                <div className="bg-green-900/20 border border-green-800 p-3 rounded">
                  <p className="text-xs text-green-300 font-mono mb-2">
                    {endpoint.response.success.code} Success
                  </p>
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    <code>
                      {JSON.stringify(endpoint.response.success.body, null, 2)}
                    </code>
                  </pre>
                </div>
              )}
              {endpoint.response.error && (
                <div className="bg-red-900/20 border border-red-800 p-3 rounded">
                  <p className="text-xs text-red-300 font-mono mb-2">
                    {endpoint.response.error.code} Error
                  </p>
                  <pre className="text-xs text-gray-300 overflow-x-auto">
                    <code>
                      {JSON.stringify(endpoint.response.error.body, null, 2)}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white">
              API Documentation
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Backstack - Plug-and-play Backend Service
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                  activeSection === section.id
                    ? "bg-white text-black font-semibold"
                    : "text-gray-300 hover:bg-zinc-800"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {currentSection?.content && !currentSection?.endpoints && (
              <Card className="bg-zinc-900 border border-zinc-800">
                <CardContent className="pt-6">
                  <p className="text-gray-300 leading-relaxed">
                    {currentSection.content}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Use Cases Section */}
            {activeSection === "usecases" && (
              <div className="space-y-4">
                {[
                  {
                    title: "Signup → Login → Verify Token",
                    code: `// 1. Sign up
await axios.post('/auth/signup', {
  name: 'John', 
  email: 'john@mail.com', 
  password: 'pass'
});

// 2. Login
const { data: loginRes } = await axios.post('/auth/login', {
  email: 'john@mail.com', 
  password: 'pass'
});
localStorage.setItem('authToken', loginRes.token);
localStorage.setItem('selectedProject', loginRes.projectId); // if project is returned on login

// 3. Verify token
const token = localStorage.getItem('authToken');
const projectId = localStorage.getItem('selectedProject');
const verifyRes = await axios.get(\`/auth/verify\`, {
  headers: { 
    'Authorization': \`Bearer \${token}\`,
    'x-project-id': projectId
  }
});
console.log('Token valid:', verifyRes.data.success);`,
                  },
                  {
                    title: "Create Schema → Insert Document",
                    code: `const token = localStorage.getItem('authToken');
const projectId = localStorage.getItem('selectedProject');

// 1. Create schema
await axios.post(\`/schema/\${projectId}\`, {
  collectionName: 'products',
  fields: [
    { fieldName: 'id', type: 'UUID', required: true },
    { fieldName: 'name', type: 'String', required: true },
    { fieldName: 'price', type: 'Integer', required: true }
  ]
}, { headers: { 'Authorization': \`Bearer \${token}\` } });

// 2. Insert document
await axios.post(\`/crud/\${projectId}/products\`, {
  name: 'Laptop',
  price: 999
}, { headers: { 'Authorization': \`Bearer \${token}\` } });`,
                  },
                  {
                    title: "Query with Pagination & Filters",
                    code: `const token = localStorage.getItem('authToken');
const projectId = localStorage.getItem('selectedProject');

// Fetch users aged 25+, limit 20, skip 10
const response = await axios.get(\`/crud/\${projectId}/users\`, {
  params: {
    limit: 20,
    offset: 10,
    filter: JSON.stringify({ age: { $gte: 25 } })
  },
  headers: { 'Authorization': \`Bearer \${token}\` }
});

console.log(response.data.documents); // Array of users
console.log(response.data.total); // Total count`,
                  },
                ].map((useCase, idx) => (
                  <Card
                    key={idx}
                    className="bg-zinc-900 border border-zinc-800"
                  >
                    <CardHeader>
                      <CardTitle className="text-white text-base">
                        {useCase.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock code={useCase.code} language="JavaScript" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Endpoints */}
            {currentSection?.endpoints && (
              <div className="space-y-4">
                {currentSection.endpoints.map((endpoint, idx) => (
                  <EndpointCard key={idx} endpoint={endpoint} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
