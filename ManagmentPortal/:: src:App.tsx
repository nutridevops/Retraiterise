// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Unauthorized from "./pages/Unauthorized";

// Client portal pages
import ClientDashboard from "./pages/client/Dashboard";
import ClientResources from "./pages/client/Resources";
import ClientBookings from "./pages/client/Bookings";
import ClientMessages from "./pages/client/Messages";
import ClientProfile from "./pages/client/Profile";
import ClientProgram from "./pages/client/Program";

// Organizer portal pages
import OrganizerDashboard from "./pages/organizer/Dashboard";
import OrganizerClients from "./pages/organizer/Clients";
import ResourceManagement from "./pages/organizer/ResourceManagement";
import OrganizerEvents from "./pages/organizer/Events";
import OrganizerBookings from "./pages/organizer/Bookings";
import OrganizerMessages from "./pages/organizer/Messages";
import OrganizerSettings from "./pages/organizer/Settings";
import OrganizerProfile from "./pages/organizer/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Client Portal Routes */}
            <Route
              path="/client/dashboard"
              element={
                <ProtectedRoute requiredRole="client">
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/resources"
              element={
                <ProtectedRoute requiredRole="client">
                  <ClientResources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/bookings"
              element={
                <ProtectedRoute requiredRole="client">
                  <ClientBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/messages"
              element={
                <ProtectedRoute requiredRole="client">
                  <ClientMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/program"
              element={
                <ProtectedRoute requiredRole="client">
                  <ClientProgram />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/profile"
              element={
                <ProtectedRoute requiredRole="client">
                  <ClientProfile />
                </ProtectedRoute>
              }
            />
            
            {/* Organizer Portal Routes */}
            <Route
              path="/organizer/dashboard"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/clients"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerClients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/resources"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <ResourceManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/bookings"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/messages"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/settings"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/profile"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerProfile />
                </ProtectedRoute>
              }
            />

            {/* Redirect paths */}
            <Route path="/client" element={<Navigate to="/client/dashboard" replace />} />
            <Route path="/organizer" element={<Navigate to="/organizer/dashboard" replace />} />
            
            {/* 404 Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;