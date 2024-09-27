import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RouterContext } from "@/routes/__root";
import {
  Link,
  rootRouteId,
  useLocation,
  useRouteContext
} from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart3Icon,
  BellIcon,
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
];

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { auth }: RouterContext = useRouteContext({ from: rootRouteId });
  const location = useLocation();
  const activePath = location.pathname.slice(1);

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="w-64 p-0 bg-gray-50">
        <SheetHeader className="flex items-center justify-between h-16 px-6 py-3 bg-white border-b">
          <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
            <Link to="/">TradingApp</Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="p-4 space-y-1">
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ease-in-out ${
                activePath === to.slice(1)
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${activePath === to.slice(1) ? "text-blue-500" : ""}`}
              />
              <span className="font-medium">{label}</span>
              {activePath === to.slice(1) && (
                <motion.div
                  className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                  layoutId="activeIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 bg-white border-t">
          <Button
            onClick={auth.logout}
            variant="outline"
            className="w-full group hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-200"
          >
            <LogOutIcon className="mr-2 h-4 w-4 group-hover:text-red-500" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
