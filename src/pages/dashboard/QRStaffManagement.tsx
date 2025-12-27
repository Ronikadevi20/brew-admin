import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useCafe } from "@/contexts/CafeContext";
import { cafeAdminService } from "@/services/cafeadmin.service";
import { getUploadUrl, API_BASE_URL } from "@/config/api.config";
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
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { PinActivityData, PinScan } from "@/types/cafeadmin.types";

export default function QRStaffManagement() {
  const { toast } = useToast();
  const { myCafe } = useCafe();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);
  const [currentPin, setCurrentPin] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [isUpdatingPin, setIsUpdatingPin] = useState(false);
  
  // PIN Activity state
  const [pinActivity, setPinActivity] = useState<PinActivityData | null>(null);

  // Load data
  const loadData = useCallback(async () => {
    if (!myCafe?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Load dashboard for PIN and QR code
      const [dashboardData, activityData] = await Promise.all([
        cafeAdminService.getDashboard(myCafe.id),
        cafeAdminService.getTodayPinActivity(myCafe.id).catch(() => null),
      ]);

      setCurrentPin(dashboardData.currentPin);
      setQrCode(myCafe.qrCode);
      
      if (activityData) {
        setPinActivity(activityData);
      }
    } catch (err: any) {
      console.error("Failed to load data:", err);
      // Don't set error for dashboard - just use cafe data
      setCurrentPin(myCafe.staffPin || null);
      setQrCode(myCafe.qrCode);
    } finally {
      setIsLoading(false);
    }
  }, [myCafe?.id, myCafe?.staffPin, myCafe?.qrCode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle PIN regeneration (random)
  const handleRegeneratePin = async () => {
    if (!myCafe?.id) return;

    setIsUpdatingPin(true);
    try {
      const result = await cafeAdminService.updatePin(myCafe.id);
      setCurrentPin(result.staffPin);
      toast({
        title: "PIN regenerated",
        description: "Your new staff PIN has been generated.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to regenerate PIN",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPin(false);
    }
  };

  // Handle custom PIN change
  const handleChangePin = async () => {
    if (!myCafe?.id) return;

    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be exactly 4 digits.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPin(true);
    try {
      const result = await cafeAdminService.updatePin(myCafe.id, newPin);
      setCurrentPin(result.staffPin);
      setNewPin("");
      setIsChangePinOpen(false);
      toast({
        title: "PIN changed",
        description: "Your staff PIN has been updated.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to change PIN",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPin(false);
    }
  };

  // Handle QR code download
  const handleDownloadQR = () => {
    if (!qrCode) {
      toast({
        title: "No QR Code",
        description: "QR code is not available.",
        variant: "destructive",
      });
      return;
    }

    // Create download link
    const link = document.createElement("a");
    link.href = getUploadUrl(qrCode) || qrCode;
    link.download = `${myCafe?.name || 'cafe'}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloading QR code",
      description: "Your QR code is being downloaded.",
    });
  };

  // Handle print
  const handlePrintQR = () => {
    toast({
      title: "Preparing print",
      description: "Opening print dialog...",
    });
    window.print();
  };

  // Format time
  const formatTime = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <Skeleton className="h-9 w-72 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] rounded-xl" />
            <div className="space-y-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // No cafe error
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
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">QR & Staff Management</h1>
          <p className="text-muted-foreground mt-1">Manage your café's QR code and staff authentication</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                <div className="w-48 h-48 bg-card border-2 border-border rounded-2xl p-4 mb-4 shadow-coffee-md overflow-hidden">
                  {qrCode ? (
                    <img
                      src={getUploadUrl(qrCode) || qrCode}
                      alt="Cafe QR Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary rounded-lg flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Customers scan this code to collect stamps
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="coffee" className="flex-1" onClick={handleDownloadQR} disabled={!qrCode}>
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
                  <div className="w-16 h-16 bg-foreground rounded mx-auto mb-2 flex items-center justify-center overflow-hidden">
                    {qrCode ? (
                      <img
                        src={getUploadUrl(qrCode) || qrCode}
                        alt="QR Preview"
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <QrCode className="w-10 h-10 text-card" />
                    )}
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
                    {currentPin ? (
                      currentPin.split("").map((digit, i) => (
                        <div
                          key={i}
                          className="w-12 h-14 bg-card rounded-xl flex items-center justify-center text-2xl font-serif font-bold text-foreground shadow-coffee-sm"
                        >
                          {showPin ? digit : "•"}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No PIN set</p>
                    )}
                  </div>
                </div>

                {/* PIN Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="cream"
                    className="flex-1"
                    onClick={handleRegeneratePin}
                    disabled={isUpdatingPin}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isUpdatingPin ? 'animate-spin' : ''}`} />
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
                          disabled={isUpdatingPin}
                        >
                          {isUpdatingPin ? "Saving..." : "Save New PIN"}
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
                    <p className="text-3xl font-serif font-bold text-foreground">
                      {pinActivity?.usesToday ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Uses today</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-serif font-bold text-foreground">
                      {pinActivity?.lastUsed ? formatTime(pinActivity.lastUsed) : "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground">Last used</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-serif font-bold text-foreground">
                      {pinActivity?.redemptions ?? 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Redemptions</p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="max-h-64 overflow-y-auto">
                  {pinActivity?.recentScans && pinActivity.recentScans.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Staff</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pinActivity.recentScans.map((scan: PinScan) => (
                          <TableRow key={scan.id}>
                            <TableCell className="text-muted-foreground">
                              {formatTime(scan.time)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={scan.action.includes("redeemed") ? "default" : "secondary"}
                                className={scan.action.includes("redeemed") ? "bg-success" : ""}
                              >
                                {scan.action}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              <span className="flex items-center gap-1">
                                {scan.verified ? (
                                  <CheckCircle className="w-3 h-3 text-success" />
                                ) : (
                                  <XCircle className="w-3 h-3 text-destructive" />
                                )}
                                {scan.staffMember}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No activity today</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}