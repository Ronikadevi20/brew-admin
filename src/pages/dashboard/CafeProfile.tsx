import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
} from "lucide-react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const amenities = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "outdoor", label: "Outdoor Seating", icon: TreePine },
  { id: "pet", label: "Pet Friendly", icon: Dog },
  { id: "smoking", label: "Smoking Area", icon: Cigarette },
  { id: "vegan", label: "Vegan Options", icon: Leaf },
  { id: "wheelchair", label: "Wheelchair Accessible", icon: Accessibility },
];

export default function CafeProfile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "Artisan Coffee House",
    description: "A cozy corner café serving specialty coffee and artisanal pastries in the heart of Karachi. We source our beans from local farmers and roast them fresh every week.",
    address: "123 Coffee Lane, DHA Phase 5, Karachi",
    lat: "24.8607",
    lng: "67.0011",
    phone: "+92 300 1234567",
    email: "hello@artisancoffee.pk",
    amenities: ["wifi", "outdoor", "vegan"],
    hours: {
      Monday: { open: "08:00", close: "22:00" },
      Tuesday: { open: "08:00", close: "22:00" },
      Wednesday: { open: "08:00", close: "22:00" },
      Thursday: { open: "08:00", close: "22:00" },
      Friday: { open: "08:00", close: "23:00" },
      Saturday: { open: "09:00", close: "23:00" },
      Sunday: { open: "09:00", close: "21:00" },
    },
  });

  const toggleAmenity = (amenityId: string) => {
    setProfile((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast({
      title: "Profile saved!",
      description: "Your café profile has been updated successfully.",
    });
    setIsLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Café Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your café's public profile and settings</p>
        </div>

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
              <div className="w-24 h-24 bg-secondary rounded-2xl flex items-center justify-center border-2 border-dashed border-border">
                <Store className="w-10 h-10 text-muted-foreground" />
              </div>
              <div>
                <Button variant="cream" className="mb-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <p className="text-sm text-muted-foreground">Recommended: 400x400px, PNG or JPG</p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Café Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  rows={4}
                  className="resize-none"
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
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </div>

            {/* Map Preview */}
            <div className="rounded-xl overflow-hidden border border-border h-48 bg-secondary flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Google Maps Preview</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  value={profile.lat}
                  onChange={(e) => setProfile({ ...profile, lat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  value={profile.lng}
                  onChange={(e) => setProfile({ ...profile, lng: e.target.value })}
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
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="pl-12"
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
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="pl-12"
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
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-28 text-sm font-medium text-foreground">{day}</span>
                  <Select
                    value={profile.hours[day as keyof typeof profile.hours].open}
                    onValueChange={(value) =>
                      setProfile({
                        ...profile,
                        hours: {
                          ...profile.hours,
                          [day]: { ...profile.hours[day as keyof typeof profile.hours], open: value },
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
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
                    value={profile.hours[day as keyof typeof profile.hours].close}
                    onValueChange={(value) =>
                      setProfile({
                        ...profile,
                        hours: {
                          ...profile.hours,
                          [day]: { ...profile.hours[day as keyof typeof profile.hours], close: value },
                        },
                      })
                    }
                  >
                    <SelectTrigger className="w-32">
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
              {amenities.map((amenity) => {
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
        <div className="flex justify-end">
          <Button
            variant="coffee"
            size="lg"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
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
