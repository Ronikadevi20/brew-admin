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
          Join the Cravd Loyalty System Partner Program
        </p>
      </div>

      {/* Plan Card */}
      {/* <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/20">
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
      </div> */}

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
                  <button type="button" className="text-primary underline hover:no-underline">
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
                    <div className="prose prose-sm text-muted-foreground space-y-4">
                      <h4 className="text-foreground font-semibold">1. Acceptance of Terms</h4>
                      <p>By creating a cafe partner account or using the Cravd Loyalty System, you agree to these Terms & Conditions. If you do not agree, you should not use the platform.</p>

                      <h4 className="text-foreground font-semibold">2. Service Description</h4>
                      <p>The Cravd Loyalty System allows partner cafes to manage their cafe profile, publish promotions and events, issue digital stamps, and offer rewards to users through the platform. Features may be updated, changed, or removed over time.</p>

                      <h4 className="text-foreground font-semibold">3. Free Access</h4>
                      <p>At this stage, the Cravd Loyalty System is provided without a subscription fee. We may introduce paid plans or premium features in the future, but any such changes will be communicated in advance.</p>

                      <h4 className="text-foreground font-semibold">4. Cafe Responsibilities</h4>
                      <p>You are responsible for ensuring that the information you publish on the platform, including cafe details, rewards, promotions, and events, is accurate, lawful, and up to date. You are also responsible for the actions of your staff using your account.</p>

                      <h4 className="text-foreground font-semibold">5. Account Security</h4>
                      <p>You must keep your login credentials and staff PINs secure. You are responsible for activity carried out through your account unless you notify us of unauthorized use.</p>

                      <h4 className="text-foreground font-semibold">6. Fair Use of the Platform</h4>
                      <p>You agree not to misuse the platform, interfere with its operation, attempt unauthorized access, manipulate stamps or rewards, or use the platform in a way that harms customers, other cafes, or the Cravd Loyalty System.</p>

                      <h4 className="text-foreground font-semibold">7. Promotions, Rewards, and Events</h4>
                      <p>Cafes are solely responsible for the rewards, promotions, discounts, and events they publish. You must honor valid offers shown to users through the platform, unless they have expired, been fully redeemed, or were removed in accordance with platform rules.</p>

                      <h4 className="text-foreground font-semibold">8. Suspension or Removal</h4>
                      <p>We may suspend, restrict, or remove access to the platform if we believe a cafe has violated these terms, engaged in fraud, misused the service, or created risk for customers or the platform.</p>

                      <h4 className="text-foreground font-semibold">9. Availability of Service</h4>
                      <p>We aim to keep the platform available and reliable, but we do not guarantee uninterrupted or error-free operation. Features may occasionally be unavailable for maintenance, updates, or technical issues.</p>

                      <h4 className="text-foreground font-semibold">10. Data and Privacy</h4>
                      <p>We collect and process information in accordance with our Privacy Policy. By using the platform, you agree to such collection and use as described there.</p>

                      <h4 className="text-foreground font-semibold">11. Limitation of Liability</h4>
                      <p>To the maximum extent permitted by law, Cravd Loyalty System is not liable for indirect, incidental, special, or consequential losses arising from use of the platform. Our role is limited to providing the digital platform, not managing cafe operations.</p>

                      <h4 className="text-foreground font-semibold">12. Changes to Terms</h4>
                      <p>We may update these Terms & Conditions from time to time. Continued use of the platform after updates means you accept the revised terms.</p>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
              {" "}and{" "}
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="text-primary underline hover:no-underline">
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
                    <div className="prose prose-sm text-muted-foreground space-y-4">
                      <h4 className="text-foreground font-semibold">1. Information We Collect</h4>
                      <p>We may collect information you provide directly, including cafe name, contact details, staff account details, business profile information, promotions, events, and support communications. We may also collect platform usage data needed to operate the service.</p>

                      <h4 className="text-foreground font-semibold">2. How We Use Information</h4>
                      <p>We use collected information to provide and improve the platform, manage cafe accounts, display cafe content to users, support stamp and reward functionality, communicate important updates, and maintain platform security.</p>

                      <h4 className="text-foreground font-semibold">3. Customer and Visit Data</h4>
                      <p>Where customer visit or reward data is processed through the platform, it is used to operate loyalty features, detect misuse, and improve service performance. We aim to limit use of such data to what is necessary for platform functionality.</p>

                      <h4 className="text-foreground font-semibold">4. Data Sharing</h4>
                      <p>We do not sell your data. We may share data with service providers or technical partners who help us operate the platform, where reasonably necessary and subject to appropriate safeguards.</p>

                      <h4 className="text-foreground font-semibold">5. Data Security</h4>
                      <p>We use reasonable technical and organizational measures to protect data against unauthorized access, misuse, loss, or disclosure. However, no online system can be guaranteed completely secure.</p>

                      <h4 className="text-foreground font-semibold">6. Data Retention</h4>
                      <p>We retain information for as long as needed to operate the platform, comply with legal obligations, resolve disputes, and enforce our policies.</p>

                      <h4 className="text-foreground font-semibold">7. Your Responsibilities</h4>
                      <p>You are responsible for ensuring that information you upload or publish through the platform is accurate and lawful, and that access to your account is restricted to authorized staff.</p>

                      <h4 className="text-foreground font-semibold">8. Policy Updates</h4>
                      <p>We may update this Privacy Policy from time to time. Continued use of the platform after updates means you accept the revised policy.</p>
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
                  <button type="button" className="text-primary underline hover:no-underline">
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
                    <div className="prose prose-sm text-muted-foreground space-y-4">
                      <h4 className="text-foreground font-semibold">1. Genuine Stamp Issuance</h4>
                      <p>Stamps may only be issued for genuine qualifying customer visits or purchases, in line with your cafe's actual stamp policy. Issuing stamps without a real transaction or visit is prohibited.</p>

                      <h4 className="text-foreground font-semibold">2. Reward Integrity</h4>
                      <p>Rewards must only be redeemed in accordance with the rules set on the platform. Cafes must not falsely mark rewards as redeemed, deny valid rewards without cause, or manipulate reward records.</p>

                      <h4 className="text-foreground font-semibold">3. PIN and Access Security</h4>
                      <p>Staff PINs, account passwords, and access credentials must be kept confidential. They must not be displayed publicly, shared with customers, or used by unauthorized persons.</p>

                      <h4 className="text-foreground font-semibold">4. Prohibited Conduct</h4>
                      <p>You may not create fake customer activity, attempt to bypass system controls, manipulate redemptions, use misleading promotions, or otherwise abuse the platform for unfair advantage.</p>

                      <h4 className="text-foreground font-semibold">5. Monitoring and Review</h4>
                      <p>We reserve the right to monitor platform activity, review suspicious usage, and investigate reports of fraud, misuse, or unusual redemption patterns.</p>

                      <h4 className="text-foreground font-semibold">6. Enforcement</h4>
                      <p>If we determine that fraudulent or abusive activity has occurred, we may suspend or terminate the account, remove rewards or promotions, restrict access to features, or take other reasonable action.</p>

                      <h4 className="text-foreground font-semibold">7. Reporting Misuse</h4>
                      <p>If you suspect fraud, unauthorized access, or misuse of the platform, you should report it to our support team as soon as possible.</p>
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