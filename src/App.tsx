import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CafeProvider } from "@/contexts/CafeContext";
import { DashboardProvider } from "@/contexts/DashboardContext";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";

// Onboarding
import OnboardingPage from "./pages/onboarding/OnboardingPage";

// Dashboard Pages
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import BDLInsights from "./pages/dashboard/BDLInsights";
import StampsVisits from "./pages/dashboard/StampsVisits";
import CafeProfile from "./pages/dashboard/CafeProfile";
import EventsPromotions from "./pages/dashboard/EventsPromotions";
import QRStaffManagement from "./pages/dashboard/QRStaffManagement";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Loading component shown during auth initialization
 */
function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-latte">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Protected route wrapper
 * Redirects to login if not authenticated
 * Redirects to onboarding if not completed (for cafe admins)
 */
function ProtectedRoute({ 
  children, 
  requireOnboarding = true,
  withDashboardProvider = false,
}: { 
  children: React.ReactNode;
  requireOnboarding?: boolean;
  withDashboardProvider?: boolean;
}) {
  const { isAuthenticated, isInitialized, user } = useAuth();

  // Show loading while checking auth state
  if (!isInitialized) {
    return <AuthLoading />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // For cafe admins, redirect to onboarding if not completed
  if (requireOnboarding && user?.role === 'CAFE_ADMIN' && !user?.hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // Wrap with DashboardProvider if needed
  if (withDashboardProvider) {
    return <DashboardProvider>{children}</DashboardProvider>;
  }

  return <>{children}</>;
}

/**
 * Onboarding route wrapper
 * Only accessible to authenticated users who haven't completed onboarding
 */
function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (!isInitialized) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If already completed onboarding, redirect to dashboard
  if (user?.hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

/**
 * Public route wrapper
 * Redirects authenticated users based on onboarding status
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized, user } = useAuth();

  if (!isInitialized) {
    return <AuthLoading />;
  }

  // Redirect authenticated users
  if (isAuthenticated) {
    // Cafe admins without onboarding go to onboarding
    if (user?.role === 'CAFE_ADMIN' && !user?.hasCompletedOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }
    // Otherwise go to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

/**
 * Application routes
 */
function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      {/* Email verification can be accessed regardless of auth state */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Onboarding Route - Only for users who haven't completed onboarding */}
      <Route
        path="/onboarding"
        element={
          <OnboardingRoute>
            <OnboardingPage />
          </OnboardingRoute>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute withDashboardProvider>
            <DashboardOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/bdl-insights"
        element={
          <ProtectedRoute withDashboardProvider>
            <BDLInsights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/stamps-visits"
        element={
          <ProtectedRoute withDashboardProvider>
            <StampsVisits />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <CafeProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/events"
        element={
          <ProtectedRoute>
            <EventsPromotions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/qr-staff"
        element={
          <ProtectedRoute>
            <QRStaffManagement />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/**
 * Main App Component
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CafeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CafeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;