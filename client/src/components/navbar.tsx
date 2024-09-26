import { AuthStoreInterface } from "@/store/auth-store";
import { Link, useRouteContext } from "@tanstack/react-router";
import {
  BarChart2,
  Home,
  LogIn,
  LogOut,
  PieChart,
  Settings,
} from "lucide-react";
import { Button } from "./ui/button";

export const Navbar = () => {
  const { auth }: { auth: AuthStoreInterface } = useRouteContext({ from: "" });
  const { user, logout, login } = auth;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
            >
              <BarChart2 className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">AlpacaTrade</span>
            </Link>
            {!!user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink to="/dashboard" icon={<Home className="h-5 w-5" />}>
                  Dashboard
                </NavLink>
                <NavLink to="/settings" icon={<Settings className="h-5 w-5" />}>
                  Settings
                </NavLink>
                <NavLink
                  to="/accountstats"
                  icon={<PieChart className="h-5 w-5" />}
                >
                  Account Stats
                </NavLink>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Button
              onClick={user ? logout : () => login("google")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
            >
              {user ? (
                <>
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign Out
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In with Google
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({
  to,
  children,
  icon,
}: {
  to: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <Link
    to={to}
    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors duration-200"
    activeProps={{
      className:
        "inline-flex items-center px-1 pt-1 border-b-2 border-emerald-500 text-sm font-medium text-gray-900",
    }}
  >
    {icon}
    <span className="ml-2">{children}</span>
  </Link>
);
