import { Coffee, LayoutDashboard, TrendingUp, Stamp, Store, Calendar, QrCode, LogOut, Bell, ChevronDown } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="w-72 bg-sidebar text-sidebar-foreground flex flex-col fixed h-full z-50">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center">
              <Coffee className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-sidebar-foreground">Café Admin</h1>
              <p className="text-xs text-sidebar-foreground/60">Karachi Coffee Culture</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className="sidebar-link"
              activeClassName="active"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={logout}
            className="sidebar-link w-full text-sidebar-foreground/70 hover:text-sidebar-foreground"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-72">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
          <div>
            <h2 className="font-serif text-lg font-semibold text-foreground">{user?.cafeName || "Café Dashboard"}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-caramel text-primary-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">AC</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground hidden sm:inline">{user?.email}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-destructive">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
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
