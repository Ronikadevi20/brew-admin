import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee } from "lucide-react";
import { useCafe } from "@/contexts/CafeContext";
import { useToast } from "@/hooks/use-toast";
import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { ProfileForm } from "@/components/onboarding/ProfileForm";
import { PinSetup } from "@/components/onboarding/PinSetup";
import { SubscriptionCard } from "@/components/onboarding/SubscriptionCard";

const ONBOARDING_STEPS = [
  { title: "Profile", description: "Café details" },
  { title: "Verification", description: "Staff PIN setup" },
  { title: "Subscription", description: "Activate plan" },
];

export default function OnboardingPage() {
  const { cafe, updateCafe, saveDraft, completeOnboarding, isLoading } = useCafe();
  const [currentStep, setCurrentStep] = useState(cafe.onboardingStep || 1);
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
      toast({
        title: "Welcome aboard! 🎉",
        description: "Your café is now set up and ready to go.",
      });
      navigate("/dashboard");
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
    </div>
  );
}