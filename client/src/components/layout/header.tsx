import { BellIcon, MenuIcon, UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export const Header = ({ setSidebarOpen }: HeaderProps) => {
  return (
    <header className="flex w-full items-center justify-between p-4 bg-white border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden"
      >
        <MenuIcon className="h-6 w-6" />
      </Button>
      <div className="flex w-full items-center justify-between space-x-4">
        <Input type="search" placeholder="Search..." className="w-64" />
        <div>
          <Button variant="ghost" size="icon">
            <BellIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <UserIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
