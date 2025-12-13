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

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

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
