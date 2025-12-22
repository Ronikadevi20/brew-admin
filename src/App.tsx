import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CafeProvider, useCafe } from "@/contexts/CafeContext";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
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
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitialized } = useAuth();

  // Show loading while checking auth state
  if (!isInitialized) {
    return <AuthLoading />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { cafe } = useCafe();
  
  // If onboarding not complete, redirect to onboarding
  if (!cafe.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const { cafe } = useCafe();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
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
      {/* Auth Routes */}
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? (cafe.onboardingComplete ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />) 
            : <LoginPage />
        } 
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Onboarding Route */}
      <Route 
        path="/onboarding" 
        element={
          <ProtectedRoute>
            {cafe.onboardingComplete ? <Navigate to="/dashboard" replace /> : <OnboardingPage />}
          </ProtectedRoute>
        } 
      />

      {/* Dashboard Routes - Allow access but show banner/locks for incomplete onboarding */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
      <Route path="/dashboard/bdl-insights" element={<ProtectedRoute><BDLInsights /></ProtectedRoute>} />
      <Route path="/dashboard/stamps-visits" element={<ProtectedRoute><StampsVisits /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute><CafeProfile /></ProtectedRoute>} />
      <Route path="/dashboard/events" element={<ProtectedRoute><EventsPromotions /></ProtectedRoute>} />
      <Route path="/dashboard/qr-staff" element={<ProtectedRoute><QRStaffManagement /></ProtectedRoute>} />

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