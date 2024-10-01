import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hue, setHue] = useState(0);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const updateHue = () => {
      setHue((prevHue) => (prevHue + 1) % 360);
    };

    window.addEventListener("mousemove", updateMousePosition);
    const interval = setInterval(updateHue, 50);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gray-900 text-white"
      style={
        {
          "--mouse-x": `${mousePosition.x}px`,
          "--mouse-y": `${mousePosition.y}px`,
          "--hue": `${hue}deg`,
        } as React.CSSProperties
      }
    >
      {/* Dynamic background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(255,255,255,0.1)_0%,transparent_60%)]" />

      {/* 404 Message with glitch effect */}
      <h1 className="text-9xl font-bold mb-4 relative">
        <span className="absolute top-0 left-0 -ml-2 text-red-500 animate-glitch-1">
          404
        </span>
        <span className="absolute top-0 left-0 ml-2 text-blue-500 animate-glitch-2">
          404
        </span>
        <span className="relative">404</span>
      </h1>

      <p className="text-2xl mb-8 animate-fade-in">Oops! Page not found</p>

      {/* Animated button */}
      <Link
        to="/"
        className="px-6 py-3 z-10 text-white rounded-full transition-all duration-300 animate-pulse-slow hover:animate-none"
        style={{
          background: `linear-gradient(90deg, hsl(var(--hue), 100%, 50%), hsl(calc(var(--hue) + 60), 100%, 50%))`,
          boxShadow: "0 0 20px rgba(255,255,255,0.3)",
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
