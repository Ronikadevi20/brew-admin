import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Coffee, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { ApiErrorResponse } from "@/types/auth.types";

type VerificationStatus = "loading" | "success" | "error" | "invalid";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useAuth();
  const { toast } = useToast();

  // Get token from URL query params
  const token = searchParams.get("token");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }

      try {
        await verifyEmail(token);
        setStatus("success");
        toast({
          title: "Email verified!",
          description: "Your email has been successfully verified.",
        });
      } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const message = axiosError.response?.data?.message || "Failed to verify email.";
        setErrorMessage(message);
        setStatus("error");
      }
    };

    verify();
  }, [token, verifyEmail, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-latte">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-coffee">
            <Coffee className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Café Admin</h1>
        </div>

        <div className="bg-card rounded-3xl shadow-coffee-xl p-8 animate-scale-in border border-border/50">
          {status === "loading" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Verifying Email</h2>
              <p className="text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Email Verified!</h2>
              <p className="text-muted-foreground mb-6">
                Your email has been successfully verified. You can now access all features.
              </p>
              <Link to="/dashboard">
                <Button variant="hero" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Verification Failed</h2>
              <p className="text-muted-foreground mb-6">
                {errorMessage || "The verification link may have expired or already been used."}
              </p>
              <Link to="/">
                <Button variant="hero" className="w-full mb-3">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}

          {status === "invalid" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Invalid Link</h2>
              <p className="text-muted-foreground mb-6">
                This verification link is invalid. Please check your email for the correct link.
              </p>
              <Link to="/">
                <Button variant="hero" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Powered by Karachi Coffee Culture Platform
        </p>
      </div>
    </div>
  );
}