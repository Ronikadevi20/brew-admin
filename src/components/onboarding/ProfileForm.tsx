import { useState, useRef } from "react";
import { useCafe } from "@/contexts/CafeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HoursEditor } from "./HoursEditor";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Hyderabad",
  "Sialkot",
];

const AREAS = [
  "Clifton",
  "DHA",
  "Gulshan-e-Iqbal",
  "Saddar",
  "PECHS",
  "Bahadurabad",
  "North Nazimabad",
  "Gulberg",
  "Korangi",
  "Malir",
  "Other",
];

interface ProfileFormProps {
  onNext: () => void;
  onSaveDraft: () => void;
  isLoading: boolean;
}

export function ProfileForm({ onNext, onSaveDraft, isLoading }: ProfileFormProps) {
  const { cafe, updateCafe } = useCafe();
  const [otherArea, setOtherArea] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, logo: "File size must be less than 2MB" }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCafe({ logo: reader.result as string });
        setErrors((prev) => ({ ...prev, logo: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    updateCafe({ logo: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!cafe.name.trim()) newErrors.name = "Café name is required";
    if (!cafe.logo) newErrors.logo = "Logo is required";
    if (!cafe.description.trim()) newErrors.description = "Description is required";
    if (cafe.description.length > 140) newErrors.description = "Max 140 characters";
    if (!cafe.address.trim()) newErrors.address = "Address is required";
    if (!cafe.city.trim()) newErrors.city = "City is required";
    if (!cafe.area && !otherArea) newErrors.area = "Area is required";
    if (!cafe.phone.trim()) newErrors.phone = "Phone is required";
    if (!cafe.email.trim()) newErrors.email = "Email is required";
    if (cafe.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cafe.email)) {
      newErrors.email = "Invalid email format";
    }
    
    // Validate operating hours (at least one day must be open)
    const hasOpenDay = cafe.operatingHours.some((h) => !h.isClosed);
    if (!hasOpenDay) newErrors.hours = "At least one day must be open";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      if (cafe.area === "Other" && otherArea) {
        updateCafe({ area: otherArea });
      }
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Set Up Your Café Profile
        </h2>
        <p className="text-muted-foreground mt-2">
          Tell us about your café so customers can find you
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Logo Upload */}
        <div className="md:col-span-2">
          <Label className="text-sm font-medium mb-2 block">Café Logo *</Label>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden",
                errors.logo ? "border-destructive" : "border-border hover:border-primary",
                cafe.logo && "border-solid border-primary"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              {cafe.logo ? (
                <img
                  src={cafe.logo}
                  alt="Café logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="mb-2"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Logo
              </Button>
              {cafe.logo && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeLogo}
                  className="ml-2 text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG up to 2MB. Square recommended.
              </p>
              {errors.logo && (
                <p className="text-xs text-destructive mt-1">{errors.logo}</p>
              )}
            </div>
          </div>
        </div>

        {/* Café Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Café Name *
          </Label>
          <Input
            id="name"
            value={cafe.name}
            onChange={(e) => updateCafe({ name: e.target.value })}
            placeholder="e.g., Artisan Coffee House"
            className={cn("mt-1.5", errors.name && "border-destructive")}
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={cafe.phone}
            onChange={(e) => updateCafe({ phone: e.target.value })}
            placeholder="+92 300 1234567"
            className={cn("mt-1.5", errors.phone && "border-destructive")}
          />
          {errors.phone && (
            <p className="text-xs text-destructive mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Short Description * <span className="text-muted-foreground font-normal">({cafe.description.length}/140)</span>
          </Label>
          <Textarea
            id="description"
            value={cafe.description}
            onChange={(e) => updateCafe({ description: e.target.value.slice(0, 140) })}
            placeholder="A cozy café serving specialty coffee and artisan pastries..."
            className={cn("mt-1.5 resize-none", errors.description && "border-destructive")}
            rows={2}
          />
          {errors.description && (
            <p className="text-xs text-destructive mt-1">{errors.description}</p>
          )}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Full Address *
          </Label>
          <Input
            id="address"
            value={cafe.address}
            onChange={(e) => updateCafe({ address: e.target.value })}
            placeholder="Shop 5, Block A, Clifton, Karachi"
            className={cn("mt-1.5", errors.address && "border-destructive")}
          />
          {errors.address && (
            <p className="text-xs text-destructive mt-1">{errors.address}</p>
          )}
        </div>

        {/* City */}
        <div>
          <Label htmlFor="city" className="text-sm font-medium">
            City *
          </Label>
          <Select
            value={cafe.city}
            onValueChange={(value) => updateCafe({ city: value })}
          >
            <SelectTrigger className={cn("mt-1.5", errors.city && "border-destructive")}>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && (
            <p className="text-xs text-destructive mt-1">{errors.city}</p>
          )}
        </div>

        {/* Area */}
        <div>
          <Label htmlFor="area" className="text-sm font-medium">
            Area / Neighbourhood *
          </Label>
          <Select
            value={cafe.area}
            onValueChange={(value) => updateCafe({ area: value })}
          >
            <SelectTrigger className={cn("mt-1.5", errors.area && "border-destructive")}>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {AREAS.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {cafe.area === "Other" && (
            <Input
              value={otherArea}
              onChange={(e) => setOtherArea(e.target.value)}
              placeholder="Enter area name"
              className="mt-2"
            />
          )}
          {errors.area && (
            <p className="text-xs text-destructive mt-1">{errors.area}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Public Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={cafe.email}
            onChange={(e) => updateCafe({ email: e.target.value })}
            placeholder="hello@yourcafe.com"
            className={cn("mt-1.5", errors.email && "border-destructive")}
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        {/* Instagram */}
        <div>
          <Label htmlFor="instagram" className="text-sm font-medium">
            Instagram
          </Label>
          <Input
            id="instagram"
            value={cafe.instagram}
            onChange={(e) => updateCafe({ instagram: e.target.value })}
            placeholder="@yourcafe"
            className="mt-1.5"
          />
        </div>

        {/* Website */}
        <div>
          <Label htmlFor="website" className="text-sm font-medium">
            Website
          </Label>
          <Input
            id="website"
            type="url"
            value={cafe.website}
            onChange={(e) => updateCafe({ website: e.target.value })}
            placeholder="https://yourcafe.com"
            className="mt-1.5"
          />
        </div>

        {/* Reward Settings Section */}
        <div className="md:col-span-2 pt-4 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Stamp Card Rewards</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure your loyalty program - how many stamps customers need to earn a reward
          </p>
        </div>

        {/* Stamps Required */}
        <div>
          <Label htmlFor="stampsRequired" className="text-sm font-medium">
            Stamps Required for Reward *
          </Label>
          <Select
            value={String(cafe.stampsRequired || 10)}
            onValueChange={(value) => updateCafe({ stampsRequired: parseInt(value) })}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select stamps" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {[5, 6, 7, 8, 9, 10].map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num} stamps
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Customers collect this many stamps to earn a reward
          </p>
        </div>

        {/* Reward Description */}
        <div>
          <Label htmlFor="rewardDescription" className="text-sm font-medium">
            Reward Offered *
          </Label>
          <Input
            id="rewardDescription"
            value={cafe.rewardDescription || ''}
            onChange={(e) => updateCafe({ rewardDescription: e.target.value })}
            placeholder="e.g., Free Coffee, 20% Off, Free Pastry"
            className="mt-1.5"
          />
          <p className="text-xs text-muted-foreground mt-1">
            What customers receive when they complete their stamp card
          </p>
        </div>

        {/* Reward Terms (Optional) */}
        <div className="md:col-span-2">
          <Label htmlFor="rewardTerms" className="text-sm font-medium">
            Terms & Conditions <span className="text-muted-foreground font-normal">(Optional)</span>
          </Label>
          <Textarea
            id="rewardTerms"
            value={cafe.rewardTerms || ''}
            onChange={(e) => updateCafe({ rewardTerms: e.target.value })}
            placeholder="e.g., Valid on any hot beverage. Cannot be combined with other offers."
            className="mt-1.5 resize-none"
            rows={2}
          />
        </div>

        {/* Operating Hours */}
        <div className="md:col-span-2">
          <HoursEditor
            hours={cafe.operatingHours}
            onChange={(hours) => updateCafe({ operatingHours: hours })}
          />
          {errors.hours && (
            <p className="text-xs text-destructive mt-1">{errors.hours}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={isLoading}
        >
          Save Draft
        </Button>
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