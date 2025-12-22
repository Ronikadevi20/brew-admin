import { useState } from "react";
import { useCafe } from "@/contexts/CafeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield, QrCode, Lock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PinSetupProps {
  onNext: () => void;
  onBack: () => void;
  onSaveDraft: () => void;
  isLoading: boolean;
}

export function PinSetup({ onNext, onBack, onSaveDraft, isLoading }: PinSetupProps) {
  const { cafe, updateCafe } = useCafe();
  const [confirmPin, setConfirmPin] = useState("");
  const [acknowledgements, setAcknowledgements] = useState({
    realVisits: false,
    noShare: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (cafe.verificationMethod === "pin") {
      if (!cafe.staffPin) {
        newErrors.pin = "PIN is required";
      } else if (cafe.staffPin.length < 4 || cafe.staffPin.length > 6) {
        newErrors.pin = "PIN must be 4-6 digits";
      } else if (!/^\d+$/.test(cafe.staffPin)) {
        newErrors.pin = "PIN must contain only numbers";
      }

      if (cafe.staffPin !== confirmPin) {
        newErrors.confirmPin = "PINs do not match";
      }
    }

    if (!acknowledgements.realVisits) {
      newErrors.realVisits = "You must acknowledge this";
    }
    if (!acknowledgements.noShare) {
      newErrors.noShare = "You must acknowledge this";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Verification Setup
        </h2>
        <p className="text-muted-foreground mt-2">
          Set up how your staff will verify customer visits
        </p>
      </div>

      {/* Verification Method */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Verification Method</Label>
        <RadioGroup
          value={cafe.verificationMethod}
          onValueChange={(value: "pin" | "qr_only") =>
            updateCafe({ verificationMethod: value })
          }
          className="grid gap-4 md:grid-cols-2"
        >
          <div
            className={cn(
              "relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
              cafe.verificationMethod === "pin"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <RadioGroupItem value="pin" id="pin" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="pin" className="cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-primary" />
                  <span className="font-medium">Staff PIN</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Staff enters a secret PIN to verify each stamp. More secure.
                </p>
              </Label>
            </div>
          </div>

          <div
            className={cn(
              "relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all",
              cafe.verificationMethod === "qr_only"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            )}
          >
            <RadioGroupItem value="qr_only" id="qr_only" className="mt-1" />
            <div className="flex-1">
              <Label htmlFor="qr_only" className="cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <QrCode className="w-4 h-4 text-accent" />
                  <span className="font-medium">QR Only</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Customers scan QR code at counter. Simpler but less secure.
                </p>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* PIN Setup - Only show if PIN method selected */}
      {cafe.verificationMethod === "pin" && (
        <div className="p-6 rounded-xl bg-muted/50 border border-border space-y-4">
          <div className="flex items-center gap-2 text-foreground">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="font-medium">Set Your Staff PIN</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="staffPin" className="text-sm font-medium">
                Enter PIN (4-6 digits) *
              </Label>
              <Input
                id="staffPin"
                type="password"
                maxLength={6}
                value={cafe.staffPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  updateCafe({ staffPin: value });
                }}
                placeholder="••••••"
                className={cn("mt-1.5 font-mono text-lg tracking-widest", errors.pin && "border-destructive")}
              />
              {errors.pin && (
                <p className="text-xs text-destructive mt-1">{errors.pin}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPin" className="text-sm font-medium">
                Confirm PIN *
              </Label>
              <Input
                id="confirmPin"
                type="password"
                maxLength={6}
                value={confirmPin}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setConfirmPin(value);
                }}
                placeholder="••••••"
                className={cn("mt-1.5 font-mono text-lg tracking-widest", errors.confirmPin && "border-destructive")}
              />
              {errors.confirmPin && (
                <p className="text-xs text-destructive mt-1">{errors.confirmPin}</p>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            This PIN will be used by your staff to verify customer stamps. Keep it secure.
          </p>
        </div>
      )}

      {/* Acknowledgements */}
      <div className="p-6 rounded-xl bg-warning/10 border border-warning/30 space-y-4">
        <div className="flex items-center gap-2 text-warning-foreground">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h3 className="font-medium">Important Acknowledgements</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="realVisits"
              checked={acknowledgements.realVisits}
              onCheckedChange={(checked) =>
                setAcknowledgements((prev) => ({ ...prev, realVisits: !!checked }))
              }
              className={errors.realVisits ? "border-destructive" : ""}
            />
            <Label
              htmlFor="realVisits"
              className="text-sm leading-relaxed cursor-pointer"
            >
              I confirm that stamps will only be issued for real, in-person visits.
              Fraudulent stamps may result in account suspension.
            </Label>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="noShare"
              checked={acknowledgements.noShare}
              onCheckedChange={(checked) =>
                setAcknowledgements((prev) => ({ ...prev, noShare: !!checked }))
              }
              className={errors.noShare ? "border-destructive" : ""}
            />
            <Label
              htmlFor="noShare"
              className="text-sm leading-relaxed cursor-pointer"
            >
              I will not share the staff PIN publicly or allow unauthorized stamp
              issuance.
            </Label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t border-border">
        <div className="flex gap-2">
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
            variant="outline"
            onClick={onSaveDraft}
            disabled={isLoading}
          >
            Save Draft
          </Button>
        </div>
        <Button
          type="button"
          onClick={handleNext}
          disabled={isLoading}
          className="min-w-[120px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
