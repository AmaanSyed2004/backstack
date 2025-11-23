import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth/AuthPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SchemasPage from "./pages/schemas/SchemasPage";
import APIsPage from "./pages/apis/APIsPage";
import BillingPage from "./pages/billing/BillingPage";
import DocsPage from "./pages/docs/DocsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import CRUDService from "./pages/crud-service/CRUDService";
import AuthService from "./pages/auth-service/AuthService";
import SettingsPage from "./pages/settings/SettingsPage";
import NewProjectPage from "./pages/new-project/NewProjectPage";

export default function App() {
  const isAuthenticated = true; // mock for now

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/projects"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProjectsPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/schemas"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SchemasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth-service"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AuthService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crud-service"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CRUDService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apis"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <APIsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/docs"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DocsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NewProjectPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
