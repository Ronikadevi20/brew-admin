import { useState } from "react";
import { Link } from "react-router-dom";
import { Coffee, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            Karachi Coffee Culture
          </h1>
          <p className="text-lg text-primary-foreground/80 text-center max-w-md animate-fade-in stagger-2 opacity-0">
            Manage your café, track customer engagement, and grow your coffee community.
          </p>
          
          {/* Floating elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-caramel/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-latte/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>
      </div>

      {/* Right Panel - Login Form */}
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
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Welcome back</h2>
              <p className="text-muted-foreground">Sign in to your café admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12"
                    required
                  />
                </div>
              </div>

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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
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
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Powered by Karachi Coffee Culture Platform
          </p>
        </div>
      </div>
    </div>
  );
}
