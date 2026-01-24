import { useState, useEffect, useCallback, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useCafe } from "@/contexts/CafeContext";
import { eventsService, offersService } from "@/services/events.service";
import { getUploadUrl } from "@/config/api.config";
import {
  Calendar,
  Clock,
  Plus,
  ImageIcon,
  Tag,
  Music,
  Mic,
  Percent,
  Gift,
  Edit,
  Trash2,
  AlertCircle,
  Users,
  MapPin,
  Coffee,
  X,
} from "lucide-react";
import type {
  Event,
  Offer,
  CreateEventRequest,
  UpdateEventRequest,
  CreateOfferRequest,
  UpdateOfferRequest,
  EventType,
  DiscountType,
} from "@/types/events.types";

// Event type options - must match backend EventType enum
const eventTypeOptions: { value: EventType; label: string }[] = [
  { value: "LIVE_MUSIC", label: "Live Music" },
  { value: "OPEN_MIC", label: "Open Mic" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "TASTING", label: "Tasting" },
  { value: "MEETUP", label: "Meetup" },
  { value: "SPECIAL_EVENT", label: "Special Event" },
  { value: "OTHER", label: "Other" },
];

// Discount type options - must match backend DiscountType enum
const discountTypeOptions: { value: DiscountType; label: string }[] = [
  { value: "PERCENTAGE", label: "Percentage Off" },
  { value: "FIXED_AMOUNT", label: "Fixed Amount Off" },
  { value: "BUY_ONE_GET_ONE", label: "Buy One Get One" },
  { value: "FREE_ITEM", label: "Free Item" },
];

// Get icon for event type
const getEventIcon = (eventType: EventType) => {
  switch (eventType) {
    case "LIVE_MUSIC":
      return Music;
    case "OPEN_MIC":
      return Mic;
    case "WORKSHOP":
      return Coffee;
    case "TASTING":
      return Coffee;
    case "MEETUP":
      return Users;
    case "SPECIAL_EVENT":
      return Gift;
    default:
      return Calendar;
  }
};

// Get icon for discount type
const getOfferIcon = (discountType: DiscountType) => {
  switch (discountType) {
    case "PERCENTAGE":
      return Percent;
    case "BUY_ONE_GET_ONE":
    case "FREE_ITEM":
      return Gift;
    default:
      return Tag;
  }
};

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// Format time for display
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

// Get status from dates
const getStatus = (startDate: string, endDate: string, isActive: boolean): "upcoming" | "active" | "ended" | "inactive" => {
  if (!isActive) return "inactive";
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return "upcoming";
  if (now > end) return "ended";
  return "active";
};

// Combined item type for unified display
type CombinedItem = 
  | { type: "event"; data: Event }
  | { type: "offer"; data: Offer };

export default function EventsPromotions() {
  const { toast } = useToast();
  const { myCafe } = useCafe();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form states
  const [createType, setCreateType] = useState<"event" | "offer">("event");
  const [editingItem, setEditingItem] = useState<CombinedItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<CombinedItem | null>(null);
  
  // Event form
  const [eventForm, setEventForm] = useState<Partial<CreateEventRequest>>({
    title: "",
    description: "",
    eventType: "OTHER",
    startDate: "",
    endDate: "",
    location: "",
    capacity: undefined,
    imageUrl: "",
  });

  // Offer form
  const [offerForm, setOfferForm] = useState<Partial<CreateOfferRequest>>({
    title: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    startDate: "",
    endDate: "",
    terms: "",
    maxRedemptions: undefined,
    code: "",
    imageUrl: "",
  });

  // Load data
  const loadData = useCallback(async () => {
    if (!myCafe?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [eventsRes, offersRes] = await Promise.all([
        eventsService.getByCafe(myCafe.id),
        offersService.getByCafe(myCafe.id),
      ]);

      setEvents(eventsRes.data || []);
      setOffers(offersRes.data || []);
    } catch (err: any) {
      console.error("Failed to load events/offers:", err);
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }, [myCafe?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset forms
  const resetEventForm = () => {
    setEventForm({
      title: "",
      description: "",
      eventType: "OTHER",
      startDate: "",
      endDate: "",
      location: "",
      capacity: undefined,
      imageUrl: "",
    });
  };

  const resetOfferForm = () => {
    setOfferForm({
      title: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      startDate: "",
      endDate: "",
      terms: "",
      maxRedemptions: undefined,
      code: "",
      imageUrl: "",
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEvent: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB allowed", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (isEvent) {
        setEventForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      } else {
        setOfferForm(prev => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Create event
  const handleCreateEvent = async () => {
    if (!myCafe?.id) return;

    if (!eventForm.title || !eventForm.description || !eventForm.startDate || !eventForm.endDate) {
      toast({ title: "Missing fields", description: "Please fill required fields", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const data: CreateEventRequest = {
        title: eventForm.title!,
        description: eventForm.description!,
        eventType: eventForm.eventType as EventType,
        startDate: new Date(eventForm.startDate!).toISOString(),
        endDate: new Date(eventForm.endDate!).toISOString(),
        location: eventForm.location || undefined,
        cafeId: myCafe.id,
        capacity: eventForm.capacity || undefined,
        imageUrl: eventForm.imageUrl || undefined,
      };

      await eventsService.create(data);
      toast({ title: "Event created!", description: `${eventForm.title} has been published.` });
      setIsCreateDialogOpen(false);
      resetEventForm();
      loadData();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to create event", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // Create offer
  const handleCreateOffer = async () => {
    if (!myCafe?.id) return;

    if (!offerForm.title || !offerForm.description || !offerForm.startDate || !offerForm.endDate) {
      toast({ title: "Missing fields", description: "Please fill required fields", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const data: CreateOfferRequest = {
        title: offerForm.title!,
        description: offerForm.description!,
        discountType: offerForm.discountType as DiscountType,
        discountValue: offerForm.discountValue || 0,
        startDate: new Date(offerForm.startDate!).toISOString(),
        endDate: new Date(offerForm.endDate!).toISOString(),
        terms: offerForm.terms || undefined,
        cafeId: myCafe.id,
        maxRedemptions: offerForm.maxRedemptions || undefined,
        code: offerForm.code || undefined,
        // Promotions should not have images
      };

      await offersService.create(data);
      toast({ title: "Promotion created!", description: `${offerForm.title} has been published.` });
      setIsCreateDialogOpen(false);
      resetOfferForm();
      loadData();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to create offer", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // Edit handlers
  const openEditDialog = (item: CombinedItem) => {
    setEditingItem(item);
    if (item.type === "event") {
      const event = item.data;
      setEventForm({
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        startDate: event.startDate.slice(0, 16),
        endDate: event.endDate.slice(0, 16),
        location: event.location || "",
        capacity: event.capacity,
        imageUrl: event.imageUrl || "",
      });
    } else {
      const offer = item.data;
      setOfferForm({
        title: offer.title,
        description: offer.description,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        startDate: offer.startDate.slice(0, 16),
        endDate: offer.endDate.slice(0, 16),
        terms: offer.terms || "",
        maxRedemptions: offer.maxRedemptions,
        code: offer.code || "",
        imageUrl: offer.imageUrl || "",
      });
    }
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    setIsSaving(true);
    try {
      if (editingItem.type === "event") {
        const data: UpdateEventRequest = {
          title: eventForm.title,
          description: eventForm.description,
          eventType: eventForm.eventType as EventType,
          startDate: eventForm.startDate ? new Date(eventForm.startDate).toISOString() : undefined,
          endDate: eventForm.endDate ? new Date(eventForm.endDate).toISOString() : undefined,
          location: eventForm.location || undefined,
          capacity: eventForm.capacity,
          imageUrl: eventForm.imageUrl?.startsWith("data:") ? eventForm.imageUrl : undefined,
        };
        await eventsService.update(editingItem.data.id, data);
        toast({ title: "Event updated!" });
      } else {
        const data: UpdateOfferRequest = {
          title: offerForm.title,
          description: offerForm.description,
          discountType: offerForm.discountType as DiscountType,
          discountValue: offerForm.discountValue,
          startDate: offerForm.startDate ? new Date(offerForm.startDate).toISOString() : undefined,
          endDate: offerForm.endDate ? new Date(offerForm.endDate).toISOString() : undefined,
          terms: offerForm.terms || undefined,
          maxRedemptions: offerForm.maxRedemptions,
          code: offerForm.code || undefined,
          imageUrl: offerForm.imageUrl?.startsWith("data:") ? offerForm.imageUrl : undefined,
        };
        await offersService.update(editingItem.data.id, data);
        toast({ title: "Promotion updated!" });
      }

      setIsEditDialogOpen(false);
      setEditingItem(null);
      resetEventForm();
      resetOfferForm();
      loadData();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to update", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handlers
  const openDeleteDialog = (item: CombinedItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    try {
      if (deletingItem.type === "event") {
        await eventsService.delete(deletingItem.data.id);
        toast({ title: "Event deleted" });
      } else {
        await offersService.delete(deletingItem.data.id);
        toast({ title: "Promotion deleted" });
      }

      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
      loadData();
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || "Failed to delete", variant: "destructive" });
    }
  };

  // Combine and sort items
  const combinedItems: CombinedItem[] = [
    ...events.map(e => ({ type: "event" as const, data: e })),
    ...offers.map(o => ({ type: "offer" as const, data: o })),
  ].sort((a, b) => {
    const dateA = new Date(a.data.startDate);
    const dateB = new Date(b.data.startDate);
    return dateB.getTime() - dateA.getTime();
  });

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex justify-between">
            <div>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
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
            <AlertDescription>Please complete your cafe setup first.</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Events & Promotions</h1>
            <p className="text-muted-foreground mt-1">Create and manage café events and special offers</p>
          </div>
          
          {/* Create Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="coffee">
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">
                  Create {createType === "event" ? "Event" : "Promotion"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {/* Type Selection */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setCreateType("event")}
                    className={`toggle-chip flex items-center gap-2 ${createType === "event" ? "active" : ""}`}
                  >
                    <Calendar className="w-4 h-4" />
                    Event
                  </button>
                  <button
                    onClick={() => setCreateType("offer")}
                    className={`toggle-chip flex items-center gap-2 ${createType === "offer" ? "active" : ""}`}
                  >
                    <Tag className="w-4 h-4" />
                    Promotion
                  </button>
                </div>

                {createType === "event" ? (
                  <>
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        placeholder="Event title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Event Type</Label>
                      <Select
                        value={eventForm.eventType}
                        onValueChange={(v) => setEventForm({ ...eventForm, eventType: v as EventType })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypeOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Description *</Label>
                      <Textarea
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        placeholder="Event description"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date & Time *</Label>
                        <Input
                          type="datetime-local"
                          value={eventForm.startDate}
                          onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date & Time *</Label>
                        <Input
                          type="datetime-local"
                          value={eventForm.endDate}
                          onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={eventForm.location}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          placeholder="e.g., Main Hall"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Capacity</Label>
                        <Input
                          type="number"
                          value={eventForm.capacity || ""}
                          onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value) || undefined })}
                          placeholder="Max attendees"
                        />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label>Image</Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true)}
                        className="hidden"
                      />
                      {eventForm.imageUrl ? (
                        <div className="relative rounded-xl overflow-hidden h-32">
                          <img
                            src={eventForm.imageUrl.startsWith("data:") ? eventForm.imageUrl : getUploadUrl(eventForm.imageUrl) || ""}
                            alt="Event"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setEventForm({ ...eventForm, imageUrl: "" })}
                            className="absolute top-2 right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent transition-colors cursor-pointer"
                        >
                          <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">Click to upload image</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input
                        value={offerForm.title}
                        onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                        placeholder="Promotion title"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Discount Type</Label>
                        <Select
                          value={offerForm.discountType}
                          onValueChange={(v) => setOfferForm({ ...offerForm, discountType: v as DiscountType })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {discountTypeOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Discount Value</Label>
                        <Input
                          type="number"
                          value={offerForm.discountValue || ""}
                          onChange={(e) => setOfferForm({ ...offerForm, discountValue: parseFloat(e.target.value) || 0 })}
                          placeholder={offerForm.discountType === "PERCENTAGE" ? "e.g., 20" : "e.g., 100"}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description *</Label>
                      <Textarea
                        value={offerForm.description}
                        onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                        placeholder="Promotion description"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date *</Label>
                        <Input
                          type="datetime-local"
                          value={offerForm.startDate}
                          onChange={(e) => setOfferForm({ ...offerForm, startDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date *</Label>
                        <Input
                          type="datetime-local"
                          value={offerForm.endDate}
                          onChange={(e) => setOfferForm({ ...offerForm, endDate: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Promo Code</Label>
                        <Input
                          value={offerForm.code}
                          onChange={(e) => setOfferForm({ ...offerForm, code: e.target.value.toUpperCase() })}
                          placeholder="e.g., WINTER20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Max Redemptions</Label>
                        <Input
                          type="number"
                          value={offerForm.maxRedemptions || ""}
                          onChange={(e) => setOfferForm({ ...offerForm, maxRedemptions: parseInt(e.target.value) || undefined })}
                          placeholder="Leave empty for unlimited"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Terms & Conditions</Label>
                      <Textarea
                        value={offerForm.terms}
                        onChange={(e) => setOfferForm({ ...offerForm, terms: e.target.value })}
                        placeholder="Optional terms"
                        rows={2}
                      />
                    </div>
                  </>
                )}

                <DialogFooter>
                  <Button
                    variant="coffee"
                    className="w-full"
                    onClick={createType === "event" ? handleCreateEvent : handleCreateOffer}
                    disabled={isSaving}
                  >
                    {isSaving ? "Creating..." : `Publish ${createType === "event" ? "Event" : "Promotion"}`}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Events/Offers Grid */}
        {combinedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {combinedItems.map((item, index) => {
              const isEvent = item.type === "event";
              const data = item.data;
              const status = getStatus(data.startDate, data.endDate, data.isActive);
              const IconComponent = isEvent 
                ? getEventIcon((data as Event).eventType) 
                : getOfferIcon((data as Offer).discountType);

              return (
                <Card
                  key={`${item.type}-${data.id}`}
                  className="group hover:shadow-coffee-xl transition-all duration-300 animate-slide-up opacity-0 overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image or Gradient - Only show images for events, not promotions */}
                  <div className="h-40 bg-gradient-warm flex items-center justify-center relative">
                    {isEvent && data.imageUrl ? (
                      <img
                        src={getUploadUrl(data.imageUrl) || ""}
                        alt={data.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <IconComponent className="w-12 h-12 text-mocha" />
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        className={isEvent ? "bg-mocha text-primary-foreground" : "bg-caramel text-primary-foreground"}
                      >
                        {isEvent ? (data as Event).eventType.replace("_", " ") : "Promotion"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          status === "active" ? "border-green-500 text-green-600" :
                          status === "upcoming" ? "border-blue-500 text-blue-600" :
                          status === "ended" ? "border-gray-400 text-gray-500" :
                          "border-red-400 text-red-500"
                        }
                      >
                        {status}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                      {data.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {data.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(data.startDate)}
                        {data.startDate !== data.endDate && ` - ${formatDate(data.endDate)}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(data.startDate)}
                      </span>
                      {isEvent && (data as Event).capacity && (
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {(data as Event).registeredCount}/{(data as Event).capacity}
                        </span>
                      )}
                      {isEvent && (data as Event).location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {(data as Event).location}
                        </span>
                      )}
                      {!isEvent && (data as Offer).code && (
                        <span className="flex items-center gap-1 font-mono bg-secondary px-2 py-0.5 rounded">
                          {(data as Offer).code}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(item)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-4">Create your first event or promotion to engage customers</p>
            <Button variant="coffee" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">
                Edit {editingItem?.type === "event" ? "Event" : "Promotion"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {editingItem?.type === "event" ? (
                <>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={eventForm.startDate}
                        onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={eventForm.endDate}
                        onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={offerForm.title}
                      onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={offerForm.description}
                      onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="datetime-local"
                        value={offerForm.startDate}
                        onChange={(e) => setOfferForm({ ...offerForm, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="datetime-local"
                        value={offerForm.endDate}
                        onChange={(e) => setOfferForm({ ...offerForm, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="coffee" onClick={handleUpdate} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete "{deletingItem?.data.title}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}