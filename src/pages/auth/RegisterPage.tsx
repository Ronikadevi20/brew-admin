import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { ApiErrorResponse } from "@/types/auth.types";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle navigation after registration state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // New users go to onboarding
      if (!user.hasCompletedOnboarding) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await register(formData);
      toast({
        title: "Account created!",
        description: "Let's set up your café profile.",
      });
      // Navigation is handled by the useEffect above after state updates
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message = axiosError.response?.data?.message || "Registration failed. Please try again.";

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        {/* Coffee bean pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="coffee-beans" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <ellipse cx="10" cy="10" rx="4" ry="6" fill="currentColor" transform="rotate(45 10 10)" />
            </pattern>
            <rect width="100" height="100" fill="url(#coffee-beans)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-primary-foreground">
          <div className="w-20 h-20 bg-caramel rounded-2xl flex items-center justify-center mb-8 shadow-glow animate-fade-in">
            <Coffee className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4 text-center animate-fade-in stagger-1 opacity-0">
            Join Karachi Coffee Culture
          </h1>
          <p className="text-lg text-primary-foreground/80 text-center max-w-md animate-fade-in stagger-2 opacity-0">
            Register your café and start building your loyal customer community today.
          </p>

          {/* Benefits list */}
          <div className="mt-8 space-y-3 animate-fade-in stagger-3 opacity-0">
            {[
              "Digital loyalty stamps",
              "Customer insights & analytics",
              "Event & promotion tools",
              "QR code verification",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-primary-foreground/90">
                <div className="w-2 h-2 rounded-full bg-caramel" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Floating elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-caramel/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-latte/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-latte">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-coffee">
              <Coffee className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-foreground">Café Admin</h1>
          </div>

          <div className="bg-card rounded-3xl shadow-coffee-xl p-8 animate-scale-in border border-border/50">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>

            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Create Account</h2>
              <p className="text-muted-foreground">Register as a café administrator</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => updateField("username", e.target.value)}
                    className={`pl-12 ${errors.username ? "border-destructive" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-destructive">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="cafe@example.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`pl-12 ${errors.email ? "border-destructive" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    className={`pl-12 ${errors.password ? "border-destructive" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    className={`pl-12 ${errors.confirmPassword ? "border-destructive" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/" className="text-accent hover:text-accent/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Powered by Karachi Coffee Culture Platform
          </p>
        </div>
      </div>
    </div>
  );
}