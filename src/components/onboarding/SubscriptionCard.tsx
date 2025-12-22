import { useState } from "react";
import { useCafe } from "@/contexts/CafeContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Check,
  CreditCard,
  FileText,
  Shield,
  Loader2,
  Coffee,
  BarChart3,
  Camera,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  onComplete: () => void;
  onBack: () => void;
  isLoading: boolean;
}

const PLAN_FEATURES = [
  { icon: Coffee, text: "Unlimited stamp issuance" },
  { icon: BarChart3, text: "Full analytics dashboard" },
  { icon: Camera, text: "BDL insights & engagement data" },
  { icon: Megaphone, text: "Publish events & promotions" },
];

export function SubscriptionCard({ onComplete, onBack, isLoading }: SubscriptionCardProps) {
  const { cafe, updateCafe } = useCafe();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!cafe.termsAccepted) {
      newErrors.terms = "You must accept the Terms & Conditions";
    }
    if (!cafe.antifraudAccepted) {
      newErrors.antifraud = "You must accept the Anti-fraud rules";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleActivate = () => {
    if (validate()) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Activate Your Subscription
        </h2>
        <p className="text-muted-foreground mt-2">
          Join the Karachi Coffee Culture Partner Program
        </p>
      </div>

      {/* Plan Card */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-serif font-semibold text-foreground">
              KCC Partner Plan
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Everything you need to grow your café
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">PKR 2,500</div>
            <div className="text-sm text-muted-foreground">per month</div>
          </div>
        </div>

        <div className="grid gap-3 mb-6">
          {PLAN_FEATURES.map((feature) => (
            <div key={feature.text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <feature.icon className="w-4 h-4 text-success" />
              </div>
              <span className="text-sm text-foreground">{feature.text}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-muted/50 border border-border">
          <h4 className="font-medium text-sm text-foreground mb-2">Plan Rules</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Billed monthly, cancel anytime</li>
            <li>• Access continues until end of billing cycle</li>
            <li>• No refunds for partial months</li>
            <li>• Fraudulent activity may result in termination</li>
          </ul>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={cafe.termsAccepted}
            onCheckedChange={(checked) =>
              updateCafe({ termsAccepted: !!checked })
            }
            className={errors.terms ? "border-destructive" : ""}
          />
          <div className="flex-1">
            <Label
              htmlFor="terms"
              className={cn(
                "text-sm leading-relaxed cursor-pointer",
                errors.terms && "text-destructive"
              )}
            >
              I agree to the{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-primary underline hover:no-underline">
                    Terms & Conditions
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Terms & Conditions
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="prose prose-sm text-muted-foreground">
                      <h4 className="text-foreground">1. Service Agreement</h4>
                      <p>By subscribing to the KCC Partner Plan, you agree to use the platform in accordance with these terms...</p>
                      
                      <h4 className="text-foreground">2. Billing & Payments</h4>
                      <p>Subscriptions are billed monthly. You will be charged on the same date each month...</p>
                      
                      <h4 className="text-foreground">3. Cancellation Policy</h4>
                      <p>You may cancel your subscription at any time. Access will continue until the end of your current billing period...</p>
                      
                      <h4 className="text-foreground">4. Data Usage</h4>
                      <p>We collect and process data in accordance with our Privacy Policy. Customer visit data is anonymized...</p>
                      
                      <h4 className="text-foreground">5. Liability</h4>
                      <p>Karachi Coffee Culture Platform is not liable for any direct or indirect damages arising from use of the service...</p>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              {" "}and{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-primary underline hover:no-underline">
                    Privacy Policy
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Privacy Policy
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="prose prose-sm text-muted-foreground">
                      <h4 className="text-foreground">1. Information We Collect</h4>
                      <p>We collect information you provide directly, including café details, contact information...</p>
                      
                      <h4 className="text-foreground">2. How We Use Information</h4>
                      <p>We use collected information to provide and improve our services, communicate with you...</p>
                      
                      <h4 className="text-foreground">3. Data Security</h4>
                      <p>We implement industry-standard security measures to protect your data...</p>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </Label>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="antifraud"
            checked={cafe.antifraudAccepted}
            onCheckedChange={(checked) =>
              updateCafe({ antifraudAccepted: !!checked })
            }
            className={errors.antifraud ? "border-destructive" : ""}
          />
          <div className="flex-1">
            <Label
              htmlFor="antifraud"
              className={cn(
                "text-sm leading-relaxed cursor-pointer",
                errors.antifraud && "text-destructive"
              )}
            >
              I agree to the{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-primary underline hover:no-underline">
                    Anti-fraud & Acceptable Use
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Anti-fraud & Acceptable Use Policy
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="prose prose-sm text-muted-foreground">
                      <h4 className="text-foreground">1. Stamp Integrity</h4>
                      <p>Stamps must only be issued for genuine customer visits. Issuing stamps without actual purchases is strictly prohibited...</p>
                      
                      <h4 className="text-foreground">2. PIN Security</h4>
                      <p>The staff PIN must be kept confidential and not shared publicly or with customers...</p>
                      
                      <h4 className="text-foreground">3. Consequences</h4>
                      <p>Violation of these rules may result in immediate account suspension without refund...</p>
                      
                      <h4 className="text-foreground">4. Reporting</h4>
                      <p>If you suspect fraudulent activity, please report it immediately to our support team...</p>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              {" "}rules
            </Label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleActivate}
          disabled={isLoading}
          className="min-w-[180px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Activate Subscription
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
