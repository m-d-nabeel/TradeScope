import { useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

type HeaderProps = {
  setSidebarOpen: (open: boolean) => void;
};

export const Header = ({ setSidebarOpen }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const pageTitle = location.pathname.split("/").pop();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stocks = [
    { symbol: "AAPL", price: 150.25, change: 2.5 },
    { symbol: "GOOGL", price: 2750.1, change: -1.2 },
    { symbol: "TSLA", price: 900.8, change: 3.7 },
  ];

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 lg:hidden rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="ml-4 text-xl capitalize font-bold text-gray-800"
            >
              {pageTitle}
            </motion.div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-gray-600 font-semibold"
                >
                  {currentTime.toLocaleTimeString()}
                </motion.div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="ml-4 flex items-center"
            >
              <button className="p-1 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
              <div className="ml-3 relative">
                <div>
                  <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {scrollY < 50 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-50 border-t border-gray-200"
          >
            <div className="max-w-7xl mx-auto py-1 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                {stocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center space-x-2"
                  >
                    <span className="text-gray-800 font-semibold">
                      {stock.symbol}
                    </span>
                    <span className="text-gray-600">
                      ${stock.price.toFixed(2)}
                    </span>
                    <span
                      className={`flex items-center ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {stock.change >= 0 ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      {Math.abs(stock.change).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
