import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { Button } from "./button";
import { Camera, CameraOff, RefreshCw } from "lucide-react";

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function QRScanner({ onScan, onError, isOpen, onClose }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  // Use state for container ID so changing it triggers re-render
  const [containerId, setContainerId] = useState(`qr-reader-${Date.now()}`);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerIdRef = useRef(containerId); // Keep ref in sync for callbacks
  const isMountedRef = useRef(true);
  const isStoppingRef = useRef(false);
  const isStartingRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    containerIdRef.current = containerId;
  }, [containerId]);

  const cleanupScanner = useCallback(async () => {
    if (!scannerRef.current || isStoppingRef.current) return;

    isStoppingRef.current = true;

    try {
      const scanner = scannerRef.current;
      scannerRef.current = null; // Clear ref immediately to prevent double cleanup

      try {
        const state = scanner.getState();
        if (state === Html5QrcodeScannerState.SCANNING ||
            state === Html5QrcodeScannerState.PAUSED) {
          await scanner.stop();
        }
      } catch (err) {
        // Ignore errors during stop - element may already be removed
        console.warn("Error stopping scanner:", err);
      }

      // Clear the container safely
      const containerId = containerIdRef.current;
      const container = document.getElementById(containerId);
      if (container) {
        // Use try-catch for DOM manipulation to handle removeChild errors
        try {
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
        } catch (domErr) {
          // Fallback: just set innerHTML
          try {
            container.innerHTML = '';
          } catch {
            // Ignore - container may already be removed
          }
        }
      }
    } finally {
      isStoppingRef.current = false;
    }
  }, []);

  const stopScanner = useCallback(async () => {
    await cleanupScanner();
    setIsScanning(false);
  }, [cleanupScanner]);

  const startScanner = useCallback(async () => {
    if (isInitializing || isScanning || isStartingRef.current || isStoppingRef.current) return;

    isStartingRef.current = true;
    setIsInitializing(true);
    setCameraError(null);

    try {
      // Wait for the DOM element to be ready
      await new Promise(resolve => setTimeout(resolve, 200));

      const containerId = containerIdRef.current;
      const containerElement = document.getElementById(containerId);

      if (!containerElement) {
        setIsInitializing(false);
        isStartingRef.current = false;
        setCameraError("Scanner container not found. Please try again.");
        return;
      }

      // Clean up existing scanner if any
      await cleanupScanner();

      if (!isMountedRef.current) {
        isStartingRef.current = false;
        return;
      }

      // Clear the container safely
      try {
        while (containerElement.firstChild) {
          containerElement.removeChild(containerElement.firstChild);
        }
      } catch {
        try {
          containerElement.innerHTML = '';
        } catch {
          // Ignore
        }
      }

      // Create new scanner instance
      scannerRef.current = new Html5Qrcode(containerId);

      // Get available cameras
      const cameras = await Html5Qrcode.getCameras();

      if (!cameras || cameras.length === 0) {
        throw new Error("NotFoundError: No camera found");
      }

      // Prefer back camera (environment facing)
      let cameraId = cameras[0].id;
      const backCamera = cameras.find(c =>
        c.label.toLowerCase().includes('back') ||
        c.label.toLowerCase().includes('environment') ||
        c.label.toLowerCase().includes('rear')
      );
      if (backCamera) {
        cameraId = backCamera.id;
      }

      if (!isMountedRef.current) {
        isStartingRef.current = false;
        return;
      }

      await scannerRef.current.start(
        cameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText) => {
          // On successful scan
          onScan(decodedText);
          stopScanner();
          onClose();
        },
        () => {
          // Ignore QR code not found errors (continuous scanning)
        }
      );

      if (isMountedRef.current) {
        setIsScanning(true);
      }
    } catch (err: any) {
      console.error("Error starting scanner:", err);

      if (!isMountedRef.current) {
        isStartingRef.current = false;
        return;
      }

      let errorMessage = "Failed to start camera. Please try again.";
      const errorString = err.toString();

      if (errorString.includes("NotAllowedError") || errorString.includes("Permission")) {
        errorMessage = "Camera access denied. Please allow camera permissions in your browser settings.";
      } else if (errorString.includes("NotFoundError") || errorString.includes("No camera")) {
        errorMessage = "No camera found on this device.";
      } else if (errorString.includes("NotReadableError") || errorString.includes("in use")) {
        errorMessage = "Camera is in use by another application. Please close other apps using the camera.";
      } else if (errorString.includes("OverconstrainedError")) {
        errorMessage = "Camera does not support the required settings. Please try a different camera.";
      }

      setCameraError(errorMessage);
      onError?.(errorMessage);
    } finally {
      isStartingRef.current = false;
      if (isMountedRef.current) {
        setIsInitializing(false);
      }
    }
  }, [onScan, onError, onClose, stopScanner, cleanupScanner, isInitializing, isScanning]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Generate a new unique ID each time we open - use state to trigger re-render
      const newId = `qr-reader-${Date.now()}`;
      setContainerId(newId);
      // Small delay to ensure the modal and container are rendered with new ID
      const timer = setTimeout(() => {
        startScanner();
      }, 400); // Slightly longer delay to ensure DOM is updated
      return () => {
        clearTimeout(timer);
      };
    } else {
      stopScanner();
    }
  }, [isOpen, startScanner, stopScanner]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Use async IIFE for cleanup
      (async () => {
        await cleanupScanner();
      })();
    };
  }, [cleanupScanner]);

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  const handleRetry = () => {
    setCameraError(null);
    // Generate new container ID to trigger re-render and avoid stale references
    const newId = `qr-reader-${Date.now()}`;
    setContainerId(newId);
    // Delay to ensure DOM is updated with new ID
    setTimeout(() => {
      startScanner();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md">
        <div className="bg-card rounded-xl shadow-coffee-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-bold text-foreground flex items-center gap-2">
              <Camera className="w-5 h-5 text-mocha" />
              Scan Reward QR Code
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
            >
              <CameraOff className="w-4 h-4" />
            </Button>
          </div>

          {/* Scanner container - must have fixed dimensions */}
          <div
            id={containerId}
            className="w-full aspect-square rounded-lg overflow-hidden bg-secondary relative"
            style={{ minHeight: '300px' }}
          >
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Starting camera...</p>
                </div>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm text-destructive">{cameraError}</p>
              <Button
                variant="cream"
                size="sm"
                className="mt-2"
                onClick={handleRetry}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {isScanning && !cameraError && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Point the camera at the customer's reward QR code
            </p>
          )}

          <Button
            variant="cream"
            className="w-full mt-4"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
