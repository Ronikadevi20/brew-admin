import { Link } from "react-router-dom";
import { useCafe } from "@/contexts/CafeContext";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureLockProps {
  children: React.ReactNode;
  featureName?: string;
  className?: string;
}

export function FeatureLock({ children, featureName = "This feature", className }: FeatureLockProps) {
  const { cafe } = useCafe();

  if (cafe.onboardingComplete) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-2">Feature Locked</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
          {featureName} is locked until you complete onboarding.
        </p>
        <Link to="/onboarding">
          <Button size="sm" variant="outline">
            Complete Onboarding
          </Button>
        </Link>
      </div>
      <div className="pointer-events-none opacity-50">
        {children}
      </div>
    </div>
  );
}