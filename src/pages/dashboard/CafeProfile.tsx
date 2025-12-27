import { useState, useEffect, useCallback, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCafe } from "@/contexts/CafeContext";
import { cafeService } from "@/services/cafe.service";
import { getUploadUrl } from "@/config/api.config";
import {
  Store,
  MapPin,
  Phone,
  Mail,
  Clock,
  Upload,
  Wifi,
  TreePine,
  Dog,
  Cigarette,
  Leaf,
  Accessibility,
  Save,
  AlertCircle,
  Instagram,
  Globe,
  X,
} from "lucide-react";
import type { OperatingHours, UpdateCafeRequest } from "@/types/cafe.types";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const amenitiesList = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "outdoor", label: "Outdoor Seating", icon: TreePine },
  { id: "pet", label: "Pet Friendly", icon: Dog },
  { id: "smoking", label: "Smoking Area", icon: Cigarette },
  { id: "vegan", label: "Vegan Options", icon: Leaf },
  { id: "wheelchair", label: "Wheelchair Accessible", icon: Accessibility },
];

// Default operating hours
const defaultHours: OperatingHours[] = daysOfWeek.map((day) => ({
  day,
  open: "08:00",
  close: "22:00",
  isClosed: false,
}));

export default function CafeProfile() {
  const { toast } = useToast();
  const { myCafe, loadMyCafe } = useCafe();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    latitude: "",
    longitude: "",
    phone: "",
    email: "",
    instagram: "",
    website: "",
    imageUrl: null as string | null,
    amenities: [] as string[],
    hours: defaultHours,
  });


  // Load cafe data
  const loadCafeData = useCallback(async () => {
    if (!myCafe) {
      setIsLoading(false);
      return;
    }

    try {
      // Parse operating hours from myCafe
      let hours = defaultHours;
      if (myCafe.openingHours) {
        if (Array.isArray(myCafe.openingHours)) {
          hours = myCafe.openingHours as OperatingHours[];
        }
      }

      // Ensure all days are present
      const hoursMap = new Map(hours.map(h => [h.day, h]));
      const fullHours = daysOfWeek.map(day => hoursMap.get(day) || {
        day,
        open: "08:00",
        close: "22:00",
        isClosed: true,
      });

      setProfile({
        name: myCafe.name || "",
        description: myCafe.description || "",
        address: myCafe.address || "",
        city: myCafe.city || "",
        latitude: myCafe.latitude?.toString() || "",
        longitude: myCafe.longitude?.toString() || "",
        phone: myCafe.phone || "",
        email: myCafe.email || "",
        instagram: myCafe.instagram || "",
        website: myCafe.website || "",
        imageUrl: myCafe.imageUrl || null,
        amenities: myCafe.amenities || [],
        hours: fullHours,
      });

      setError(null);
    } catch (err: any) {
      console.error("Failed to load cafe data:", err);
      setError("Failed to load cafe profile");
    } finally {
      setIsLoading(false);
    }
  }, [myCafe]);

  // Load data when myCafe changes
  useEffect(() => {
    loadCafeData();
  }, [loadCafeData]);

  // Track changes
  const updateProfile = (updates: Partial<typeof profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      updateProfile({ imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const removeImage = () => {
    updateProfile({ imageUrl: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Toggle amenity
  const toggleAmenity = (amenityId: string) => {
    const newAmenities = profile.amenities.includes(amenityId)
      ? profile.amenities.filter((a) => a !== amenityId)
      : [...profile.amenities, amenityId];
    updateProfile({ amenities: newAmenities });
  };

  // Update hours for a specific day
  const updateHours = (day: string, field: "open" | "close" | "isClosed", value: string | boolean) => {
    const newHours = profile.hours.map(h => {
      if (h.day === day) {
        return { ...h, [field]: value };
      }
      return h;
    });
    updateProfile({ hours: newHours });
  };

  // Save profile
  const handleSave = async () => {
    if (!myCafe?.id) {
      toast({
        title: "Error",
        description: "No cafe found. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Prepare update data
      const updateData: UpdateCafeRequest = {
        name: profile.name,
        description: profile.description || null,
        address: profile.address,
        city: profile.city,
        latitude: profile.latitude ? parseFloat(profile.latitude) : null,
        longitude: profile.longitude ? parseFloat(profile.longitude) : null,
        phone: profile.phone || null,
        email: profile.email || null,
        instagram: profile.instagram || null,
        website: profile.website || null,
        amenities: profile.amenities,
        openingHours: profile.hours.filter(h => !h.isClosed),
      };

      // Only include imageUrl if it's a new base64 image (starts with data:)
      if (profile.imageUrl && profile.imageUrl.startsWith("data:")) {
        updateData.imageUrl = profile.imageUrl;
      }

      await cafeService.update(myCafe.id, updateData);

      // Refresh cafe data
      await loadMyCafe();

      toast({
        title: "Profile saved!",
        description: "Your café profile has been updated successfully.",
      });

      setHasChanges(false);
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 max-w-4xl">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </DashboardLayout>
    );
  }

  // Error state (no cafe)
  if (!myCafe) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Cafe Found</AlertTitle>
            <AlertDescription>
              {error || "Please complete your cafe setup first."}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Café Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your café's public profile and settings</p>
          </div>
          {hasChanges && (
            <span className="text-sm text-caramel font-medium">Unsaved changes</span>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Basic Info */}
        <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-mocha" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-secondary rounded-2xl flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
                  {profile.imageUrl ? (
                    <img
                      src={profile.imageUrl.startsWith('data:') ? profile.imageUrl : getUploadUrl(profile.imageUrl) || ''}
                      alt="Cafe logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                {profile.imageUrl && (
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="cream"
                  className="mb-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {profile.imageUrl ? "Change Logo" : "Upload Logo"}
                </Button>
                <p className="text-sm text-muted-foreground">Recommended: 400x400px, PNG or JPG</p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Café Name *</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => updateProfile({ name: e.target.value })}
                  placeholder="Your café name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => updateProfile({ description: e.target.value })}
                  rows={4}
                  className="resize-none"
                  placeholder="Tell customers about your café..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-mocha" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => updateProfile({ address: e.target.value })}
                  placeholder="Street address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={profile.city}
                  onChange={(e) => updateProfile({ city: e.target.value })}
                  placeholder="City"
                />
              </div>
            </div>

            {/* Map Preview */}
            <div className="rounded-xl overflow-hidden border border-border h-48 bg-secondary">
              {profile.latitude && profile.longitude &&
                !isNaN(parseFloat(profile.latitude)) && !isNaN(parseFloat(profile.longitude)) ? (
                <iframe
                  title="Cafe Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(profile.longitude) - 0.005}%2C${parseFloat(profile.latitude) - 0.005}%2C${parseFloat(profile.longitude) + 0.005}%2C${parseFloat(profile.latitude) + 0.005}&layer=mapnik&marker=${profile.latitude}%2C${profile.longitude}`}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Enter coordinates to see map preview</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  value={profile.latitude}
                  onChange={(e) => updateProfile({ latitude: e.target.value })}
                  placeholder="e.g., 24.8607"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  value={profile.longitude}
                  onChange={(e) => updateProfile({ longitude: e.target.value })}
                  placeholder="e.g., 67.0011"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-mocha" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => updateProfile({ phone: e.target.value })}
                    className="pl-12"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => updateProfile({ email: e.target.value })}
                    className="pl-12"
                    placeholder="hello@yourcafe.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative">
                  <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="instagram"
                    value={profile.instagram}
                    onChange={(e) => updateProfile({ instagram: e.target.value })}
                    className="pl-12"
                    placeholder="@yourcafe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => updateProfile({ website: e.target.value })}
                    className="pl-12"
                    placeholder="https://yourcafe.com"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opening Hours */}
        <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-mocha" />
              Opening Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.hours.map((dayHours) => (
                <div key={dayHours.day} className="flex items-center gap-4">
                  <span className="w-28 text-sm font-medium text-foreground">{dayHours.day}</span>

                  <button
                    onClick={() => updateHours(dayHours.day, "isClosed", !dayHours.isClosed)}
                    className={`toggle-chip text-xs ${dayHours.isClosed ? "" : "active"}`}
                  >
                    {dayHours.isClosed ? "Closed" : "Open"}
                  </button>

                  {!dayHours.isClosed && (
                    <>
                      <Select
                        value={dayHours.open}
                        onValueChange={(value) => updateHours(dayHours.day, "open", value)}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0") + ":00";
                            return (
                              <SelectItem key={hour} value={hour}>
                                {hour}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select
                        value={dayHours.close}
                        onValueChange={(value) => updateHours(dayHours.day, "close", value)}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, "0") + ":00";
                            return (
                              <SelectItem key={hour} value={hour}>
                                {hour}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Amenities & Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {amenitiesList.map((amenity) => {
                const isActive = profile.amenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`toggle-chip flex items-center gap-2 ${isActive ? "active" : ""}`}
                  >
                    <amenity.icon className="w-4 h-4" />
                    {amenity.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          {hasChanges && (
            <Button
              variant="outline"
              onClick={() => {
                loadCafeData();
                setHasChanges(false);
              }}
            >
              Discard Changes
            </Button>
          )}
          <Button
            variant="coffee"
            size="lg"
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Save Changes
              </span>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}