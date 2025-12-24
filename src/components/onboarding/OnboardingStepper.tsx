import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingStepperProps {
  currentStep: number;
  steps: { title: string; description: string }[];
}

export function OnboardingStepper({ currentStep, steps }: OnboardingStepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;
          
          return (
            <div key={step.title} className="flex items-center flex-1">
              <div className="flex flex-col items-center relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2",
                    isCompleted && "bg-success border-success text-success-foreground",
                    isCurrent && "bg-primary border-primary text-primary-foreground shadow-lg",
                    !isCompleted && !isCurrent && "bg-muted border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors duration-300",
                    isCompleted ? "bg-success" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}