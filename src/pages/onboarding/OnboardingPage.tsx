import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee, Clock, CheckCircle, Mail } from "lucide-react";
import { useCafe } from "@/contexts/CafeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import authService from "@/services/auth.service";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { ProfileForm } from "@/components/onboarding/ProfileForm";
import { PinSetup } from "@/components/onboarding/PinSetup";
import { SubscriptionCard } from "@/components/onboarding/SubscriptionCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User } from "@/types/auth.types";

const ONBOARDING_STEPS = [
  { title: "Profile", description: "Café details" },
  { title: "Verification", description: "Staff PIN setup" },
  { title: "Subscription", description: "Activate plan" },
];

export default function OnboardingPage() {
  const { cafe, updateCafe, saveDraft, completeOnboarding, isLoading } = useCafe();
  const { logout, user, refreshAuth } = useAuth();
  const [currentStep, setCurrentStep] = useState(cafe.onboardingStep || 1);
  const [showApprovalPending, setShowApprovalPending] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    updateCafe({ onboardingStep: nextStep });
  };

  const handleBack = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    updateCafe({ onboardingStep: prevStep });
  };

  const handleSaveDraft = async () => {
    const success = await saveDraft();
    if (success) {
      toast({
        title: "Draft saved",
        description: "Your progress has been saved.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async () => {
    try {
      await completeOnboarding();

      // Fetch fresh user data directly to get the latest account status
      const freshUser = await authService.getCurrentUser();

      // For cafe admins, check account status
      // If PENDING, show the approval dialog; otherwise navigate to dashboard
      if (freshUser?.role === 'CAFE_ADMIN' && freshUser?.accountStatus === 'PENDING') {
        console.log('User is pending approval:', freshUser);
        setPendingUser(freshUser);
        setShowApprovalPending(true);
      } else {
        // Account is approved or user is not a cafe admin
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Onboarding error:', error);

      // Extract error message from response
      let errorMessage = "Failed to complete setup. Please try again.";

      if (error.response?.data?.errors) {
        // Handle validation errors array
        const errors = error.response.data.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          errorMessage = errors.map((e: any) => e.message || e.field).join(', ');
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleLogoutAndExit = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-latte">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-foreground">
                Café Setup
              </h1>
              <p className="text-xs text-muted-foreground">
                Karachi Coffee Culture
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Stepper */}
        <OnboardingStepper currentStep={currentStep} steps={ONBOARDING_STEPS} />

        {/* Step Content */}
        <div className="mt-8 bg-card rounded-2xl shadow-coffee-xl border border-border/50 p-8">
          {currentStep === 1 && (
            <ProfileForm
              onNext={handleNext}
              onSaveDraft={handleSaveDraft}
              isLoading={isLoading}
            />
          )}

          {currentStep === 2 && (
            <PinSetup
              onNext={handleNext}
              onBack={handleBack}
              onSaveDraft={handleSaveDraft}
              isLoading={isLoading}
            />
          )}

          {currentStep === 3 && (
            <SubscriptionCard
              onComplete={handleComplete}
              onBack={handleBack}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Need help? Contact us at support@karachicoffee.com
        </p>
      </main>

      {/* Account Pending Approval Dialog */}
      <Dialog open={showApprovalPending} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <DialogTitle className="text-xl font-semibold text-center">
              Account Pending Approval
            </DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4">
              <div className="flex items-start gap-3 text-left bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Setup Complete!</p>
                  <p className="text-sm text-green-700">
                    Your café profile has been successfully created.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left bg-amber-50 p-4 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Awaiting Verification</p>
                  <p className="text-sm text-amber-700">
                    Our team will review your application and verify your café details.
                    This typically takes 1-2 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left bg-blue-50 p-4 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Email Notification</p>
                  <p className="text-sm text-blue-700">
                    You'll receive an email at <strong>{pendingUser?.email || user?.email}</strong> once your account is approved.
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground pt-2">
                You won't be able to access the dashboard until your account is approved.
                Please check your email for updates.
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 mt-4">
            <Button onClick={handleLogoutAndExit} className="w-full">
              Got it, I'll wait for approval
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Questions? Contact support@coffeeculture.com
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
