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
import { cafeService } from "@/services/cafe.service";
import { getUploadUrl, API_BASE_URL } from "@/config/api.config";
import { Textarea } from "@/components/ui/textarea";
import { QRScanner } from "@/components/ui/qr-scanner";
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
  AlertCircle,
  CheckCircle,
  XCircle,
  Gift,
  Scan,
  PartyPopper,
  Settings,
  Save,
  Coffee,
  Camera,
} from "lucide-react";
import type { PinActivityData, PinScan, RewardRedemptionResult } from "@/types/cafeadmin.types";

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

  // Reward Redemption state
  const [redemptionToken, setRedemptionToken] = useState("");
  const [isValidatingRedemption, setIsValidatingRedemption] = useState(false);
  const [redemptionResult, setRedemptionResult] = useState<RewardRedemptionResult | null>(null);
  const [redemptionError, setRedemptionError] = useState<string | null>(null);

  // Reward Settings state
  const [stampsRequired, setStampsRequired] = useState(10);
  const [rewardDescription, setRewardDescription] = useState("Free Coffee");
  const [rewardTerms, setRewardTerms] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsChanged, setSettingsChanged] = useState(false);

  // QR Scanner state
  const [isScannerOpen, setIsScannerOpen] = useState(false);

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

      // Load reward settings from cafe
      setStampsRequired(myCafe.stampsRequired ?? 10);
      setRewardDescription(myCafe.rewardDescription ?? "Free Coffee");
      setRewardTerms(myCafe.rewardTerms ?? "");
      setSettingsChanged(false);

      if (activityData) {
        setPinActivity(activityData);
      }
    } catch (err: any) {
      console.error("Failed to load data:", err);
      // Don't set error for dashboard - just use cafe data
      setCurrentPin(myCafe.staffPin || null);
      setQrCode(myCafe.qrCode);
      // Still load reward settings
      setStampsRequired(myCafe.stampsRequired ?? 10);
      setRewardDescription(myCafe.rewardDescription ?? "Free Coffee");
      setRewardTerms(myCafe.rewardTerms ?? "");
      setSettingsChanged(false);
    } finally {
      setIsLoading(false);
    }
  }, [myCafe?.id, myCafe?.staffPin, myCafe?.qrCode, myCafe?.stampsRequired, myCafe?.rewardDescription, myCafe?.rewardTerms]);

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

  // Clear redemption result
  const handleClearRedemption = () => {
    setRedemptionResult(null);
    setRedemptionError(null);
    setRedemptionToken("");
  };

  // Handle code redemption (from manual entry or QR scan)
  const handleQRScan = (scannedCode: string) => {
    if (!myCafe?.id) {
      setRedemptionError("No cafe configured");
      return;
    }

    const code = scannedCode.trim().toUpperCase();
    setRedemptionToken(code);

    // Validate and redeem the code
    setIsValidatingRedemption(true);
    setRedemptionError(null);
    setRedemptionResult(null);

    cafeAdminService.redeemCode(code, myCafe.id)
      .then(async (result) => {
        setRedemptionResult(result);
        setRedemptionToken("");
        toast({
          title: "Reward Redeemed!",
          description: `Successfully redeemed ${result.reward} for ${result.user.username}`,
        });
        // Refresh PIN activity
        if (myCafe?.id) {
          const activityData = await cafeAdminService.getTodayPinActivity(myCafe.id).catch(() => null);
          if (activityData) {
            setPinActivity(activityData);
          }
        }
      })
      .catch((err: any) => {
        const errorMessage = err.response?.data?.message || err.message || "Failed to validate redemption code";
        setRedemptionError(errorMessage);
        toast({
          title: "Redemption Failed",
          description: errorMessage,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsValidatingRedemption(false);
      });
  };

  // Handle reward settings change
  const handleSettingsChange = (
    field: 'stampsRequired' | 'rewardDescription' | 'rewardTerms',
    value: string | number
  ) => {
    setSettingsChanged(true);
    if (field === 'stampsRequired') {
      setStampsRequired(value as number);
    } else if (field === 'rewardDescription') {
      setRewardDescription(value as string);
    } else if (field === 'rewardTerms') {
      setRewardTerms(value as string);
    }
  };

  // Save reward settings
  const handleSaveRewardSettings = async () => {
    if (!myCafe?.id) return;

    // Validation
    if (stampsRequired < 1 || stampsRequired > 20) {
      toast({
        title: "Invalid stamps required",
        description: "Stamps required must be between 1 and 20.",
        variant: "destructive",
      });
      return;
    }

    if (!rewardDescription.trim()) {
      toast({
        title: "Missing reward description",
        description: "Please enter a reward description.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingSettings(true);
    try {
      await cafeService.update(myCafe.id, {
        stampsRequired,
        rewardDescription: rewardDescription.trim(),
        rewardTerms: rewardTerms.trim() || null,
      });

      setSettingsChanged(false);
      toast({
        title: "Settings saved",
        description: "Your reward settings have been updated.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsSavingSettings(false);
    }
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

        {/* Reward Redemption Section - Full Width */}
        <Card className="hover:shadow-coffee-xl transition-shadow duration-300 border-2 border-mocha/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-mocha" />
              Redeem Customer Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            {redemptionResult ? (
              // Success State
              <div className="space-y-6">
                <div className="bg-success/10 border border-success/30 rounded-xl p-6 text-center">
                  <PartyPopper className="w-12 h-12 text-success mx-auto mb-4" />
                  <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                    Reward Redeemed Successfully!
                  </h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="text-lg">
                      <span className="font-medium text-foreground">{redemptionResult.user.username}</span>
                    </p>
                    <p className="text-2xl font-serif font-bold text-mocha">
                      {redemptionResult.reward}
                    </p>
                    <p className="text-sm">
                      Redeemed at {formatTime(redemptionResult.redeemedAt)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="coffee"
                  className="w-full"
                  onClick={handleClearRedemption}
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Another Reward
                </Button>
              </div>
            ) : (
              // Scan State
              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-muted-foreground">
                    Ask the customer for their 6-letter redemption code, or scan their QR code with your camera.
                  </p>
                </div>

                {redemptionError && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Redemption Failed</AlertTitle>
                    <AlertDescription>{redemptionError}</AlertDescription>
                  </Alert>
                )}

                {/* Manual Code Entry - Primary Method */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Enter 6-Letter Code</Label>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      maxLength={6}
                      value={redemptionToken}
                      onChange={(e) => setRedemptionToken(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                      placeholder="ABCDEF"
                      className="text-center text-2xl tracking-[0.5em] font-mono uppercase flex-1"
                      disabled={isValidatingRedemption}
                    />
                    <Button
                      variant="coffee"
                      size="lg"
                      onClick={() => handleQRScan(redemptionToken)}
                      disabled={isValidatingRedemption || redemptionToken.length !== 6}
                      className="px-8"
                    >
                      {isValidatingRedemption ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Verify
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ask the customer to show you their 6-letter code from the app
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Important</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Redemption codes expire after 60 seconds. Ask the customer to generate a new code if it has expired.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* QR Scanner Modal */}
            <QRScanner
              isOpen={isScannerOpen}
              onClose={() => setIsScannerOpen(false)}
              onScan={handleQRScan}
              onError={(error) => {
                toast({
                  title: "Camera Error",
                  description: error,
                  variant: "destructive",
                });
              }}
            />
          </CardContent>
        </Card>

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

        {/* Reward Settings Section - Full Width */}
        <Card className="hover:shadow-coffee-xl transition-shadow duration-300 border-2 border-mocha/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-mocha" />
              Stamp Card Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Stamps Required */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="stamps-required" className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-mocha" />
                    Stamps Required for Reward
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="stamps-required"
                      type="number"
                      min={1}
                      max={20}
                      value={stampsRequired}
                      onChange={(e) => handleSettingsChange('stampsRequired', parseInt(e.target.value) || 1)}
                      className="w-24 text-center text-xl font-bold"
                    />
                    <span className="text-muted-foreground">stamps = 1 reward</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Customers need to collect this many stamps to earn their reward (1-20)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward-description" className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-mocha" />
                    Reward Description
                  </Label>
                  <Input
                    id="reward-description"
                    type="text"
                    value={rewardDescription}
                    onChange={(e) => handleSettingsChange('rewardDescription', e.target.value)}
                    placeholder="e.g., Free Coffee, 50% Off, Free Pastry"
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground">
                    What customers receive when they redeem their stamps
                  </p>
                </div>
              </div>

              {/* Right Column - Terms & Preview */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reward-terms">Terms & Conditions (Optional)</Label>
                  <Textarea
                    id="reward-terms"
                    value={rewardTerms}
                    onChange={(e) => handleSettingsChange('rewardTerms', e.target.value)}
                    placeholder="e.g., Valid on drinks only. Cannot be combined with other offers."
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground">
                    Any conditions or restrictions for the reward
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6 pt-4 border-t">
              <Button
                variant="coffee"
                onClick={handleSaveRewardSettings}
                disabled={isSavingSettings || !settingsChanged}
                className="min-w-[150px]"
              >
                {isSavingSettings ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>

            {settingsChanged && (
              <div className="flex items-center gap-2 mt-4 text-sm text-warning">
                <AlertCircle className="w-4 h-4" />
                You have unsaved changes
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}