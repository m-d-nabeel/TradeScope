import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loading() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white text-gray-900 dark:bg-gray-900 dark:text-white"
      style={
        {
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
        } as React.CSSProperties
      }
    >
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.1)_0%,transparent_60%)]" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="relative mb-8 h-16 w-16"
      >
        <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 opacity-25" />
        <div className="absolute inset-0 rotate-45 rounded-full border-t-2 border-purple-500 opacity-50" />
        <div className="absolute inset-0 rotate-90 rounded-full border-t-2 border-pink-500 opacity-75" />
      </motion.div>

      <motion.h1
        className="text-2xl font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        Loading...
      </motion.h1>

      <motion.div className="mt-4 flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="h-2 w-2 rounded-full bg-white"
            animate={{
              y: ["0%", "-50%", "0%"],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
