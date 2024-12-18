import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { AlertOctagon, Home, RefreshCw } from "lucide-react";
import React from "react";

export function ErrorComponent({
  error,
  mode = "dark",
}: {
  error: Error;
  mode?: "light" | "dark";
}) {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHoveringRefresh, setIsHoveringRefresh] = React.useState(false);
  const [isHoveringHome, setIsHoveringHome] = React.useState(false);

  React.useEffect(() => {
    setErrorMessage(error.message || "An unexpected error occurred");

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [error]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const isDark = mode === "dark";

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center overflow-hidden ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
      style={
        {
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
        } as React.CSSProperties
      }
    >
      {/* Dynamic background */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.1)_0%,transparent_60%)]"
            : "bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(0,0,0,0.05)_0%,transparent_60%)]"
        }`}
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`z-10 w-full max-w-md overflow-hidden rounded-lg ${
          isDark ? "bg-gray-800 bg-opacity-50" : "bg-white bg-opacity-70"
        } p-8 shadow-2xl backdrop-blur-md`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center"
        >
          <div
            className={`absolute inset-0 rounded-full ${
              isDark
                ? "bg-gradient-to-r from-red-500 to-purple-500 opacity-20"
                : "bg-gradient-to-r from-orange-300 to-rose-300 opacity-30"
            }`}
          />
          <AlertOctagon
            className={`relative z-10 h-12 w-12 ${isDark ? "text-red-500" : "text-red-600"}`}
          />
        </motion.div>
        <motion.h1
          className="mb-4 text-center text-3xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Oops! Something went wrong
        </motion.h1>
        <motion.p
          key={errorMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mb-8 text-center"
        >
          {errorMessage}
        </motion.p>
        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className={`relative flex items-center space-x-2 overflow-hidden rounded-full ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            } px-6 py-2 transition-all duration-300`}
            onMouseEnter={() => setIsHoveringRefresh(true)}
            onMouseLeave={() => setIsHoveringRefresh(false)}
          >
            <AnimatePresence>
              {isHoveringRefresh && (
                <motion.div
                  className={`absolute inset-0 ${
                    isDark
                      ? "bg-gradient-to-r from-blue-600 to-purple-600"
                      : "bg-gradient-to-r from-blue-400 to-purple-400"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </AnimatePresence>
            <RefreshCw className="relative z-10 h-4 w-4" />
            <span className="relative z-10">Refresh</span>
          </motion.button>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative flex items-center space-x-2 overflow-hidden rounded-full ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } px-6 py-2 transition-all duration-300`}
              onMouseEnter={() => setIsHoveringHome(true)}
              onMouseLeave={() => setIsHoveringHome(false)}
            >
              <AnimatePresence>
                {isHoveringHome && (
                  <motion.div
                    className={`absolute inset-0 ${
                      isDark
                        ? "bg-gradient-to-r from-purple-600 to-pink-600"
                        : "bg-gradient-to-r from-purple-400 to-pink-400"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
              <Home className="relative z-10 h-4 w-4" />
              <span className="relative z-10">Go Home</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
