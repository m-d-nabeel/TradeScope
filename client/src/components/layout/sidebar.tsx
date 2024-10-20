import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAuthQueries } from "@/hooks/use-auth.hook";
import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  BarChart3Icon,
  BellIcon,
  CalendarIcon,
  CandlestickChartIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HelpCircleIcon,
  HomeIcon,
  LineChartIcon,
  LogOutIcon,
  TrendingUpIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface LinkItem {
  to: string;
  icon: React.ElementType;
  label: string;
  subLinks: LinkItem[];
}

const links: LinkItem[] = [
  { to: "/dashboard", icon: HomeIcon, label: "Dashboard", subLinks: [] },
  { to: "/trade", icon: TrendingUpIcon, label: "Trade", subLinks: [] },
  { to: "/portfolio", icon: BarChart3Icon, label: "Portfolio", subLinks: [] },
  {
    to: "/market",
    icon: BarChart3Icon,
    label: "Market",
    subLinks: [
      { to: "/market/assets", icon: BarChart3Icon, label: "Assets", subLinks: [] },
      { to: "/market/calendar", icon: CalendarIcon, label: "Calendar", subLinks: [] },
      { to: "/market/bars", icon: LineChartIcon, label: "Bars", subLinks: [] },
      { to: "/market/stocks", icon: CandlestickChartIcon, label: "Stocks", subLinks: [] },
    ],
  },
  { to: "/alerts", icon: BellIcon, label: "Alerts", subLinks: [] },
  { to: "/account", icon: UserIcon, label: "Account", subLinks: [] },
  { to: "/help", icon: HelpCircleIcon, label: "Help", subLinks: [] },
];

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { logout } = useAuthQueries();
  const location = useLocation();
  const activePath = location.pathname.slice(1);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (to: string) => {
    setOpenMenus((prev) =>
      prev.includes(to) ? prev.filter((item) => item !== to) : [...prev, to],
    );
  };

  const renderLink = (link: LinkItem, depth = 0) => {
    const isActive = activePath.startsWith(link.to.slice(1));
    const hasSubLinks = link.subLinks.length > 0;
    const isOpen = openMenus.includes(link.to);

    return (
      <div key={link.to} className={`${depth > 0 ? "ml-4" : ""}`}>
        {hasSubLinks ? (
          <Collapsible open={isOpen} onOpenChange={() => toggleMenu(link.to)}>
            <CollapsibleTrigger asChild>
              <button
                className={`my-1 flex w-full items-center justify-between rounded-lg px-2 py-[6px] transition-all duration-200 ease-in-out ${
                  isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <link.icon className={`h-5 w-5 ${isActive ? "text-blue-500" : ""}`} />
                  <span className="font-medium">{link.label}</span>
                </div>
                {isOpen ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1">
              {link.subLinks.map((subLink) => renderLink(subLink, depth + 1))}
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <Link
            to={link.to}
            className={`my-1 flex items-center space-x-2 rounded-lg px-2 py-[6px] transition-all duration-200 ease-in-out ${
              isActive ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <link.icon className={`h-5 w-5 ${isActive ? "text-blue-500" : ""}`} />
            <span className="font-medium">{link.label}</span>
            {isActive && (
              <motion.div
                className="absolute left-0 h-8 w-1 rounded-r-full bg-blue-500"
                layoutId="activeIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        )}
      </div>
    );
  };

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="w-64 bg-gray-50 p-0">
        <SheetHeader className="flex h-16 items-center justify-between border-b bg-white px-6 py-3">
          <SheetTitle className="bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-2xl font-bold text-transparent">
            <Link to="/">TradingApp</Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-1 p-4">{links.map((link) => renderLink(link))}</nav>
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
