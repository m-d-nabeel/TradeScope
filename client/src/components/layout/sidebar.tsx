import { Link } from "@tanstack/react-router";
import {
  BarChart3Icon,
  BellIcon,
  HomeIcon,
  LogOutIcon,
  TrendingUpIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { Button } from "../ui/button";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  return (
    <aside
      className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b">
        <Link to="/" className="text-2xl font-semibold">
          TradingApp
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
        >
          <XIcon className="h-6 w-6" />
        </Button>
      </div>
      <nav className="p-4 space-y-2">
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/trade"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <TrendingUpIcon className="h-5 w-5" />
          <span>Trade</span>
        </Link>
        <Link
          to="/portfolio"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <BarChart3Icon className="h-5 w-5" />
          <span>Portfolio</span>
        </Link>
        <Link
          to="/market"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <BarChart3Icon className="h-5 w-5" />
          <span>Market</span>
        </Link>
        <Link
          to="/alerts"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <BellIcon className="h-5 w-5" />
          <span>Alerts</span>
        </Link>
        <Link
          to="/account"
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <UserIcon className="h-5 w-5" />
          <span>Account</span>
        </Link>
      </nav>
      <div className="absolute bottom-0 w-full p-4">
        <Button variant="outline" className="w-full">
          <LogOutIcon className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </aside>
  );
};
