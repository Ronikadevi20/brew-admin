import { useNavigate } from "react-router-dom";
import { useCafe } from "@/contexts/CafeContext";
import { useAuth } from "@/contexts/AuthContext";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { ProfileForm } from "@/components/onboarding/ProfileForm";
import { PinSetup } from "@/components/onboarding/PinSetup";
import { SubscriptionCard } from "@/components/onboarding/SubscriptionCard";
import { Coffee } from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  { title: "Profile", description: "Café details" },
  { title: "Verification", description: "Staff PIN" },
  { title: "Subscription", description: "Activate plan" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cafe, updateCafe, saveDraft, completeOnboarding, isLoading } = useCafe();

  const handleSaveDraft = async () => {
    const success = await saveDraft();
    if (success) {
      toast.success("Draft saved successfully");
    } else {
      toast.error("Failed to save draft");
    }
  };

  const handleStepChange = (step: number) => {
    updateCafe({ onboardingStep: step });
  };

  const handleComplete = async () => {
    updateCafe({ subscriptionStatus: "pending" });
    const success = await completeOnboarding();
    if (success) {
      toast.success("Onboarding complete! Welcome to KCC.", {
        description: "Your subscription is being processed.",
      });
      navigate("/dashboard");
    } else {
      toast.error("Failed to complete onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-latte">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Coffee className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-foreground">
                Karachi Coffee Culture
              </h1>
              <p className="text-xs text-muted-foreground">Café Partner Setup</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Setting up your café</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stepper */}
        <div className="bg-card rounded-2xl shadow-coffee-md border border-border/50 p-6 mb-8">
          <OnboardingStepper currentStep={cafe.onboardingStep} steps={STEPS} />
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-2xl shadow-coffee-md border border-border/50 p-8">
          {cafe.onboardingStep === 1 && (
            <ProfileForm
              onNext={() => handleStepChange(2)}
              onSaveDraft={handleSaveDraft}
              isLoading={isLoading}
            />
          )}
          {cafe.onboardingStep === 2 && (
            <PinSetup
              onNext={() => handleStepChange(3)}
              onBack={() => handleStepChange(1)}
              onSaveDraft={handleSaveDraft}
              isLoading={isLoading}
            />
          )}
          {cafe.onboardingStep === 3 && (
            <SubscriptionCard
              onComplete={handleComplete}
              onBack={() => handleStepChange(2)}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Need help? Contact us at{" "}
          <a href="mailto:support@kcc.pk" className="text-primary hover:underline">
            support@kcc.pk
          </a>
        </p>
      </main>
    </div>
  );
}
