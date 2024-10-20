import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuthQueries } from "@/hooks/use-auth.hook";
import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart3Icon,
  BellIcon,
  HelpCircleIcon,
  HomeIcon,
  LogOutIcon,
  TrendingUpIcon,
  UserIcon,
} from "lucide-react";
import { Button } from "../ui/button";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const links = [
  { to: "/dashboard", icon: HomeIcon, label: "Dashboard" },
  { to: "/trade", icon: TrendingUpIcon, label: "Trade" },
  { to: "/portfolio", icon: BarChart3Icon, label: "Portfolio" },
  { to: "/market", icon: BarChart3Icon, label: "Market" },
  { to: "/alerts", icon: BellIcon, label: "Alerts" },
  { to: "/account", icon: UserIcon, label: "Account" },
  { to: "/help", icon: HelpCircleIcon, label: "Help" },
];

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { logout } = useAuthQueries();
  const location = useLocation();
  const activePath = location.pathname.slice(1);

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="w-64 bg-gray-50 p-0">
        <SheetHeader className="flex h-16 items-center justify-between border-b bg-white px-6 py-3">
          <SheetTitle className="bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-2xl font-bold text-transparent">
            <Link to="/">TradingApp</Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-1 p-4">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-2 rounded-lg p-2 transition-all duration-200 ease-in-out ${
                activePath === to.slice(1)
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon className={`h-5 w-5 ${activePath === to.slice(1) ? "text-blue-500" : ""}`} />
              <span className="font-medium">{label}</span>
              {activePath === to.slice(1) && (
                <motion.div
                  className="absolute left-0 h-8 w-1 rounded-r-full bg-blue-500"
                  layoutId="activeIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t bg-white p-4">
          <Button
            onClick={logout}
            variant="outline"
            className="group w-full transition-colors duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOutIcon className="mr-2 h-4 w-4 group-hover:text-red-500" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
