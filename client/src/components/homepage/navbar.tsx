import { useAuthQueries } from "@/hooks/use-auth.hook";
import { Link } from "@tanstack/react-router";
import {
  BarChart2,
  Home,
  LogIn,
  LogOut,
  PieChart,
  Settings,
} from "lucide-react";
import { Button } from "../ui/button";

export const Navbar = () => {
  const { login, logout, user } = useAuthQueries();

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex flex-shrink-0 items-center text-emerald-600 transition-colors duration-200 hover:text-emerald-800"
            >
              <BarChart2 className="mr-2 h-8 w-8" />
              <span className="text-xl font-bold">AlpacaTrade</span>
            </Link>
            {!!user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink to="/dashboard" icon={<Home className="h-5 w-5" />}>
                  Dashboard
                </NavLink>
                <NavLink to="/settings" icon={<Settings className="h-5 w-5" />}>
                  Settings
                </NavLink>
                <NavLink to="/account" icon={<PieChart className="h-5 w-5" />}>
                  Account Stats
                </NavLink>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Button
              onClick={user ? logout : () => login("google")}
              className="inline-flex items-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              {user ? (
                <>
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
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
    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 transition-colors duration-200 hover:border-gray-300 hover:text-gray-700"
    activeProps={{
      className:
        "inline-flex items-center px-1 pt-1 border-b-2 border-emerald-500 text-sm font-medium text-gray-900",
    }}
  >
    {icon}
    <span className="ml-2">{children}</span>
  </Link>
);
