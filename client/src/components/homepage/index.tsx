import { AuthContext } from "@/routes/__root";
import { Link, useLoaderData } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, DollarSign, Shield, TrendingUp, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { FeatureCard } from "./feature-card";
import { Navbar } from "./navbar";

export const Homepage = () => {
  const auth = useLoaderData({ from: "/" as const }) as AuthContext;
  const { user, login, logout } = auth;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <Navbar user={user} login={login} logout={logout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to <span className="text-emerald-600">AlpacaTrade</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Empower your financial future with our cutting-edge trading platform
          </p>
          {!user && (
            <Button
              onClick={() => login("google")}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Get Started Now
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
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
          className="bg-white rounded-lg shadow-xl overflow-hidden"
        >
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-full object-cover w-full md:w-48"
                src="src/assets/trading-chart.jpg"
                alt="Trading chart"
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-emerald-500 font-semibold">
                Why Choose Us
              </div>
              <h2 className="block mt-1 text-2xl leading-tight font-bold text-gray-900">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of successful traders on our platform today
          </p>
          {!user ? (
            <Button
              onClick={() => login("google")}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Sign Up Now
            </Button>
          ) : (
            <Link
              from={""}
              to="/dashboard"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Go to Dashboard
            </Link>
          )}
        </motion.div>
      </main>
    </div>
  );
};
