import { useAuthQueries } from "@/hooks/use-auth.hook";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, DollarSign, Shield, TrendingUp, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { FeatureCard } from "./feature-card";
import { Navbar } from "./navbar";

export const Homepage = () => {
  const { isAuthenticated, login } = useAuthQueries();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 text-5xl font-extrabold text-gray-900">
            Welcome to <span className="text-emerald-600">AlpacaTrade</span>
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Empower your financial future with our cutting-edge trading platform
          </p>
          {!isAuthenticated && (
            <Button
              onClick={() => login("google")}
              size="lg"
              className="transform rounded-full bg-emerald-600 px-6 py-3 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-emerald-700"
            >
              Get Started Now
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          <FeatureCard
            icon={TrendingUp}
            title="Real-Time Trading"
            description="Execute trades instantly with our lightning-fast platform"
          />
          <FeatureCard
            icon={Shield}
            title="Secure Investments"
            description="Your assets are protected with bank-level security measures"
          />
          <FeatureCard
            icon={Zap}
            title="Advanced Analytics"
            description="Make informed decisions with our powerful analytical tools"
          />
          <FeatureCard
            icon={DollarSign}
            title="Commission-Free"
            description="Trade stocks and ETFs without any commission fees"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="overflow-hidden rounded-lg bg-white shadow-xl"
        >
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-full w-full object-cover md:w-48"
                src="src/assets/trading-chart.jpg"
                alt="Trading chart"
              />
            </div>
            <div className="p-8">
              <div className="text-sm font-semibold uppercase tracking-wide text-emerald-500">
                Why Choose Us
              </div>
              <h2 className="mt-1 block text-2xl font-bold leading-tight text-gray-900">
                Revolutionize Your Trading Experience
              </h2>
              <p className="mt-2 text-gray-600">
                Our platform leverages the power of the Alpaca API to provide
                you with a seamless, efficient, and intelligent trading
                experience. From beginners to seasoned pros, we've got the tools
                you need to succeed in the market.
              </p>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="inline-flex items-center border border-emerald-500 text-emerald-500 hover:bg-emerald-50"
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Ready to Start Trading?
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Join thousands of successful traders on our platform today
          </p>
          {!isAuthenticated ? (
            <Button
              onClick={() => login("google")}
              size="lg"
              className="transform rounded-full bg-emerald-600 px-6 py-3 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-emerald-700"
            >
              Sign Up Now
            </Button>
          ) : (
            <Link
              from={""}
              to="/dashboard"
              className="transform rounded-full bg-emerald-600 px-6 py-3 font-bold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-emerald-700"
            >
              Go to Dashboard
            </Link>
          )}
        </motion.div>
      </main>
    </div>
  );
};
