import { useState, useEffect } from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { 
  Coffee, 
  LayoutDashboard, 
  TrendingUp, 
  Stamp, 
  Store, 
  Calendar, 
  QrCode, 
  LogOut, 
  Bell, 
  ChevronDown,
  Menu,
  X 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCafe } from "@/contexts/CafeContext";
import { notificationsService } from "@/services/notifications.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OnboardingBanner } from "@/components/dashboard/OnboardingBanner";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard Overview", path: "/dashboard", icon: LayoutDashboard },
  { title: "BDL Insights", path: "/dashboard/bdl-insights", icon: TrendingUp },
  { title: "Stamps & Visits", path: "/dashboard/stamps-visits", icon: Stamp },
  { title: "Café Profile", path: "/dashboard/profile", icon: Store },
  { title: "Events & Promotions", path: "/dashboard/events", icon: Calendar },
  { title: "QR & Staff", path: "/dashboard/qr-staff", icon: QrCode },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { cafe, myCafe } = useCafe();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);


  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const stats = await notificationsService.getStats();
        setUnreadCount(stats.unread);
      } catch (error) {
        console.error("Failed to fetch notification stats:", error);
      }
    };

    fetchNotificationCount();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchNotificationCount, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const getUserInitials = () => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "CA";
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-72 bg-sidebar text-sidebar-foreground flex flex-col fixed h-full z-50 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center">
                <Coffee className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-lg font-semibold text-sidebar-foreground">
                  Café Admin
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  Karachi Coffee Culture
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <RouterNavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </RouterNavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium w-full text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="font-serif text-lg font-semibold text-foreground">
                {myCafe?.name || cafe.name || "Café Dashboard"}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-caramel text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={myCafe?.imageUrl || ""} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground hidden sm:inline">
                    {user?.email}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          {!cafe.onboardingComplete && <OnboardingBanner />}
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
          Powered by Karachi Coffee Culture Platform
        </footer>
      </div>
    </div>
  );
}

export default DashboardLayout;