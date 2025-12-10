import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  QrCode,
  Download,
  Printer,
  RefreshCw,
  Key,
  Eye,
  EyeOff,
  Shield,
  Clock,
  User,
  AlertCircle,
} from "lucide-react";

const pinLogsData = [
  { id: 1, time: "5:32 PM", action: "Stamp given", staffMember: "Staff #1" },
  { id: 2, time: "5:28 PM", action: "Stamp given", staffMember: "Staff #1" },
  { id: 3, time: "5:15 PM", action: "Stamp given", staffMember: "Staff #2" },
  { id: 4, time: "4:45 PM", action: "Stamp given", staffMember: "Staff #1" },
  { id: 5, time: "4:32 PM", action: "Free drink redeemed", staffMember: "Staff #2" },
  { id: 6, time: "4:20 PM", action: "Stamp given", staffMember: "Staff #1" },
  { id: 7, time: "4:10 PM", action: "Stamp given", staffMember: "Staff #1" },
  { id: 8, time: "3:55 PM", action: "Stamp given", staffMember: "Staff #2" },
];

export default function QRStaffManagement() {
  const { toast } = useToast();
  const [showPin, setShowPin] = useState(false);
  const [currentPin, setCurrentPin] = useState("4829");
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [newPin, setNewPin] = useState("");

  const handleRegeneratePin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setCurrentPin(pin);
    toast({
      title: "PIN regenerated",
      description: "Your new staff PIN has been generated.",
    });
  };

  const handleChangePin = () => {
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits.",
        variant: "destructive",
      });
      return;
    }
    setCurrentPin(newPin);
    setNewPin("");
    setIsChangePinOpen(false);
    toast({
      title: "PIN changed",
      description: "Your staff PIN has been updated.",
    });
  };

  const handleDownloadQR = () => {
    toast({
      title: "Downloading QR code",
      description: "Your QR code is being downloaded.",
    });
  };

  const handlePrintQR = () => {
    toast({
      title: "Preparing print",
      description: "Opening print dialog...",
    });
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">QR & Staff Management</h1>
          <p className="text-muted-foreground mt-1">Manage your café's QR code and staff authentication</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-mocha" />
                Café QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code Display */}
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 bg-card border-2 border-border rounded-2xl p-4 mb-4 shadow-coffee-md">
                  <div className="w-full h-full bg-foreground rounded-lg flex items-center justify-center">
                    <div className="w-36 h-36 bg-card rounded grid grid-cols-7 grid-rows-7 gap-0.5 p-2">
                      {/* QR Code Pattern Simulation */}
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            Math.random() > 0.4 ? "bg-foreground" : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Customers scan this code to collect stamps
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="coffee" className="flex-1" onClick={handleDownloadQR}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="cream" className="flex-1" onClick={handlePrintQR}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>

              {/* Mockup Preview */}
              <div className="bg-gradient-warm rounded-xl p-6 text-center">
                <p className="text-sm font-medium text-mocha mb-3">Table Tent Preview</p>
                <div className="bg-card rounded-lg p-4 max-w-[150px] mx-auto shadow-coffee-md">
                  <div className="w-16 h-16 bg-foreground rounded mx-auto mb-2 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-card" />
                  </div>
                  <p className="text-[10px] text-foreground font-medium">Scan for Stamps</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-mocha" />
                  Staff Instructions
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Place QR code on each table or counter</li>
                  <li>• Customer scans code to open stamp card</li>
                  <li>• Staff enters PIN to confirm stamp</li>
                  <li>• 10 stamps = 1 free drink</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Staff PIN Section */}
          <div className="space-y-6">
            <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-mocha" />
                  Staff PIN Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current PIN */}
                <div className="bg-secondary/50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Current PIN</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPin(!showPin)}
                    >
                      {showPin ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    {currentPin.split("").map((digit, i) => (
                      <div
                        key={i}
                        className="w-12 h-14 bg-card rounded-xl flex items-center justify-center text-2xl font-serif font-bold text-foreground shadow-coffee-sm"
                      >
                        {showPin ? digit : "•"}
                      </div>
                    ))}
                  </div>
                </div>

                {/* PIN Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="cream"
                    className="flex-1"
                    onClick={handleRegeneratePin}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Dialog open={isChangePinOpen} onOpenChange={setIsChangePinOpen}>
                    <DialogTrigger asChild>
                      <Button variant="coffee" className="flex-1">
                        <Key className="w-4 h-4 mr-2" />
                        Change PIN
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="font-serif text-xl">Change Staff PIN</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>New 4-digit PIN</Label>
                          <Input
                            type="text"
                            maxLength={4}
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                            placeholder="Enter 4 digits"
                            className="text-center text-2xl tracking-widest"
                          />
                        </div>
                        <Button
                          variant="coffee"
                          className="w-full"
                          onClick={handleChangePin}
                        >
                          Save New PIN
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Security Note */}
                <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-xl">
                  <Shield className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Security Reminder</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Share this PIN only with trusted staff members. Change it regularly for security.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PIN Usage Stats */}
            <Card className="hover:shadow-coffee-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-mocha" />
                  Today's PIN Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <p className="text-3xl font-serif font-bold text-foreground">47</p>
                    <p className="text-xs text-muted-foreground">Uses today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-serif font-bold text-foreground">5:32 PM</p>
                    <p className="text-xs text-muted-foreground">Last used</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-serif font-bold text-foreground">3</p>
                    <p className="text-xs text-muted-foreground">Redemptions</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Staff</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pinLogsData.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-muted-foreground">{log.time}</TableCell>
                          <TableCell>
                            <Badge
                              variant={log.action.includes("redeemed") ? "default" : "secondary"}
                              className={log.action.includes("redeemed") ? "bg-success" : ""}
                            >
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {log.staffMember}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
