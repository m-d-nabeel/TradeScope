import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { AlertOctagon, Home, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export function ErrorComponent({ error }: { error: Error }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setErrorMessage(error.message || "An unexpected error occurred");
  }, [error]);

  const handleRefresh = () => {
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-lg shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 bg-rose-500 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <AlertOctagon className="text-white w-12 h-12" />
          </motion.div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Oops! Something went wrong
          </h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={errorMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-gray-600 mb-8"
            >
              {errorMessage}
            </motion.p>
          </AnimatePresence>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="px-6 py-2 bg-rose-500 text-white rounded-full flex items-center space-x-2 hover:bg-rose-600 transition-colors duration-300"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </motion.button>
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-teal-500 text-white rounded-full flex items-center space-x-2 hover:bg-teal-600 transition-colors duration-300"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </motion.button>
            </Link>
          </div>
        </div>
        <div className="bg-gray-100 p-4">
          <p className="text-center text-gray-600 text-sm">
            If the problem persists, please contact our support team.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
