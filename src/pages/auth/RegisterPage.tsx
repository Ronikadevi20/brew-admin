import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, Mail, User, ArrowRight, ArrowLeft, Lock, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRegistrationForm,
} from "@/lib/validation";
import type { ApiErrorResponse } from "@/types/auth.types";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle navigation after registration state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.hasCompletedOnboarding) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Real-time validation for individual fields
  const validateField = useCallback((field: string, value: string) => {
    let result;
    switch (field) {
      case 'username':
        result = validateUsername(value);
        break;
      case 'email':
        result = validateEmail(value);
        break;
      case 'password':
        result = validatePassword(value);
        // Also revalidate confirm password if it's been touched
        if (touched.confirmPassword && formData.confirmPassword) {
          const confirmResult = validateConfirmPassword(value, formData.confirmPassword);
          setErrors(prev => ({
            ...prev,
            confirmPassword: confirmResult.isValid ? '' : confirmResult.message,
          }));
        }
        break;
      case 'confirmPassword':
        result = validateConfirmPassword(formData.password, value);
        break;
      default:
        return;
    }

    setErrors(prev => ({
      ...prev,
      [field]: result.isValid ? '' : result.message,
    }));
  }, [formData.password, formData.confirmPassword, touched.confirmPassword]);

  // Check if field is valid (for showing success state)
  const isFieldValid = useMemo(() => ({
    username: touched.username && !errors.username && formData.username.length > 0,
    email: touched.email && !errors.email && formData.email.length > 0,
    password: touched.password && !errors.password && formData.password.length > 0,
    confirmPassword: touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword.length > 0,
  }), [touched, errors, formData]);

  // Update field value and validate
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validate on change if field has been touched
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // Mark field as touched on blur and validate
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
  };

  // Full form validation on submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Validate entire form
    const validation = validateRegistrationForm(formData);
    setErrors(validation.errors);

    if (!validation.isValid) {
      // Focus first error field
      const firstError = Object.keys(validation.errors)[0];
      document.getElementById(firstError)?.focus();
      return;
    }

    try {
      await register(formData);
      toast({
        title: "Account created!",
        description: "Let's set up your café profile.",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const responseData = axiosError.response?.data;

      // Handle field-specific errors from backend
      if (responseData?.errors) {
        const backendErrors: Record<string, string> = {};
        Object.entries(responseData.errors).forEach(([field, messages]) => {
          backendErrors[field] = Array.isArray(messages) ? messages[0] : messages;
        });
        setErrors(prev => ({ ...prev, ...backendErrors }));
      }

      toast({
        title: "Registration failed",
        description: responseData?.message || "Please check your information and try again.",
        variant: "destructive",
      });
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

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Username */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className={cn(
                    "text-sm font-medium",
                    errors.username && touched.username ? "text-destructive" : "text-foreground"
                  )}
                >
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
                    onBlur={() => handleBlur("username")}
                    className={cn(
                      "pl-12 pr-10",
                      errors.username && touched.username && "border-destructive focus-visible:ring-destructive/20",
                      isFieldValid.username && "border-green-500 focus-visible:ring-green-500/20"
                    )}
                    disabled={isLoading}
                    aria-invalid={!!errors.username}
                    aria-describedby={errors.username ? "username-error" : "username-hint"}
                  />
                  {/* Status icon */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {errors.username && touched.username && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                    {isFieldValid.username && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
                {errors.username && touched.username ? (
                  <p id="username-error" className="text-xs text-destructive animate-in slide-in-from-top-1 duration-200" role="alert">
                    {errors.username}
                  </p>
                ) : (
                  <p id="username-hint" className="text-xs text-muted-foreground">
                    3-20 characters, letters, numbers, and underscores only
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className={cn(
                    "text-sm font-medium",
                    errors.email && touched.email ? "text-destructive" : "text-foreground"
                  )}
                >
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
                    onBlur={() => handleBlur("email")}
                    className={cn(
                      "pl-12 pr-10",
                      errors.email && touched.email && "border-destructive focus-visible:ring-destructive/20",
                      isFieldValid.email && "border-green-500 focus-visible:ring-green-500/20"
                    )}
                    disabled={isLoading}
                    aria-invalid={!!errors.email}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {errors.email && touched.email && (
                      <AlertCircle className="w-5 h-5 text-destructive" />
                    )}
                    {isFieldValid.email && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
                {errors.email && touched.email && (
                  <p className="text-xs text-destructive animate-in slide-in-from-top-1 duration-200" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className={cn(
                    "text-sm font-medium",
                    errors.password && touched.password ? "text-destructive" : "text-foreground"
                  )}
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={cn(
                      "pl-12 pr-12",
                      errors.password && touched.password && "border-destructive focus-visible:ring-destructive/20",
                      isFieldValid.password && "border-green-500 focus-visible:ring-green-500/20"
                    )}
                    disabled={isLoading}
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-xs text-destructive animate-in slide-in-from-top-1 duration-200" role="alert">
                    {errors.password}
                  </p>
                )}
                {/* Password Strength Indicator */}
                {formData.password && (
                  <PasswordStrengthIndicator
                    password={formData.password}
                    showRequirements={true}
                  />
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className={cn(
                    "text-sm font-medium",
                    errors.confirmPassword && touched.confirmPassword ? "text-destructive" : "text-foreground"
                  )}
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={cn(
                      "pl-12 pr-12",
                      errors.confirmPassword && touched.confirmPassword && "border-destructive focus-visible:ring-destructive/20",
                      isFieldValid.confirmPassword && "border-green-500 focus-visible:ring-green-500/20"
                    )}
                    disabled={isLoading}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-xs text-destructive animate-in slide-in-from-top-1 duration-200" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
                {isFieldValid.confirmPassword && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Passwords match
                  </p>
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