import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  Plus,
  Image,
  Tag,
  Music,
  Mic,
  Percent,
  Gift,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

const eventsData = [
  {
    id: 1,
    title: "Live Jazz Night",
    description: "Enjoy smooth jazz with your evening coffee. Featuring the Karachi Jazz Quartet.",
    date: "Dec 15, 2024",
    time: "7:00 PM - 10:00 PM",
    type: "event",
    image: null,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Open Mic Poetry",
    description: "Share your poems and stories in our cozy café atmosphere.",
    date: "Dec 18, 2024",
    time: "6:00 PM - 9:00 PM",
    type: "event",
    image: null,
    status: "upcoming",
  },
  {
    id: 3,
    title: "20% Off All Lattes",
    description: "Celebrate winter with 20% off on all latte variations. Valid all day!",
    date: "Dec 10 - Dec 20, 2024",
    time: "All Day",
    type: "promotion",
    image: null,
    status: "active",
  },
  {
    id: 4,
    title: "Buy 2 Get 1 Free Pastries",
    description: "Our special holiday pastry deal. Perfect for sharing with friends.",
    date: "Dec 1 - Dec 31, 2024",
    time: "All Day",
    type: "promotion",
    image: null,
    status: "active",
  },
];

export default function EventsPromotions() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [events, setEvents] = useState(eventsData);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "event" as "event" | "promotion",
  });

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const event = {
      id: events.length + 1,
      ...newEvent,
      image: null,
      status: "upcoming" as const,
    };

    setEvents([event, ...events]);
    setNewEvent({ title: "", description: "", date: "", time: "", type: "event" });
    setIsDialogOpen(false);

    toast({
      title: "Event created!",
      description: `${newEvent.title} has been published.`,
    });
  };

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((e) => e.id !== id));
    toast({
      title: "Event deleted",
      description: "The event has been removed.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Events & Promotions</h1>
            <p className="text-muted-foreground mt-1">Create and manage café events and special offers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="coffee">
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">Create Event or Promotion</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {/* Type Selection */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewEvent({ ...newEvent, type: "event" })}
                    className={`toggle-chip flex items-center gap-2 ${newEvent.type === "event" ? "active" : ""}`}
                  >
                    <Calendar className="w-4 h-4" />
                    Event
                  </button>
                  <button
                    onClick={() => setNewEvent({ ...newEvent, type: "promotion" })}
                    className={`toggle-chip flex items-center gap-2 ${newEvent.type === "promotion" ? "active" : ""}`}
                  >
                    <Tag className="w-4 h-4" />
                    Promotion
                  </button>
                </div>

                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Enter title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Image</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-accent transition-colors cursor-pointer">
                    <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                  </div>
                </div>

                <Button
                  variant="coffee"
                  className="w-full"
                  onClick={handleCreateEvent}
                >
                  Publish {newEvent.type === "event" ? "Event" : "Promotion"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event, index) => (
            <Card
              key={event.id}
              className="group hover:shadow-coffee-xl transition-all duration-300 animate-slide-up opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Placeholder */}
              <div className="h-40 bg-gradient-warm rounded-t-2xl flex items-center justify-center">
                {event.type === "event" ? (
                  event.title.includes("Jazz") ? (
                    <Music className="w-12 h-12 text-mocha" />
                  ) : (
                    <Mic className="w-12 h-12 text-mocha" />
                  )
                ) : event.title.includes("Off") ? (
                  <Percent className="w-12 h-12 text-mocha" />
                ) : (
                  <Gift className="w-12 h-12 text-mocha" />
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant={event.type === "event" ? "default" : "secondary"}
                    className={event.type === "event" ? "bg-mocha text-primary-foreground" : "bg-caramel text-primary-foreground"}
                  >
                    {event.type === "event" ? "Event" : "Promotion"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={event.status === "active" ? "border-success text-success" : ""}
                  >
                    {event.status}
                  </Badge>
                </div>

                <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </span>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No events yet</h3>
            <p className="text-muted-foreground mb-4">Create your first event or promotion to engage customers</p>
            <Button variant="coffee" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
