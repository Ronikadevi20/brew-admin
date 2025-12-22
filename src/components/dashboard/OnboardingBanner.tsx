import { Link } from "react-router-dom";
import { useCafe } from "@/contexts/CafeContext";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OnboardingBanner() {
  const { cafe } = useCafe();

  if (cafe.onboardingComplete) return null;

  return (
    <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-6 flex items-center justify-between gap-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-warning" />
        </div>
        <div>
          <h3 className="font-medium text-foreground">Complete Your Onboarding</h3>
          <p className="text-sm text-muted-foreground">
            Finish setup to unlock all dashboard features including stamping and promotions.
          </p>
        </div>
      </div>
      <Link to="/onboarding">
        <Button size="sm" className="whitespace-nowrap">
          Continue Setup
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}
