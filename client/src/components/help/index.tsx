import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, DollarSign, Mail, RefreshCw, Search } from "lucide-react";
import { useState } from "react";

export function HelpPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const sections = [
    {
      title: "Getting Started",
      icon: <DollarSign className="h-5 w-5" />,
      content: [
        {
          subtitle: "Account Setup",
          description: "How to create and log into your account.",
        },
        {
          subtitle: "Connecting Broker Accounts",
          description: "Simple instructions on linking your Alpaca account to the app.",
        },
      ],
    },
    {
      title: "Using the App",
      icon: <Search className="h-5 w-5" />,
      content: [
        {
          subtitle: "Viewing Stocks",
          description: "How to search for and view stock information (price, percentage change).",
        },
        {
          subtitle: "Favorite Stocks",
          description: "How to add or remove stocks from your favorites.",
        },
      ],
    },
    {
      title: "Troubleshooting",
      icon: <RefreshCw className="h-5 w-5" />,
      content: [
        {
          subtitle: "Data Not Updating",
          description:
            "Refresh the page or reconnect to your Alpaca account if stock prices don't update.",
        },
      ],
    },
    {
      title: "Contact Support",
      icon: <Mail className="h-5 w-5" />,
      content: [
        {
          subtitle: "Support",
          description: "Email us at support@tradingapp.com for assistance.",
        },
      ],
    },
  ];

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            className="overflow-hidden rounded-lg border border-gray-200 bg-slate-50 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <button
              className="flex w-full items-center justify-between px-4 py-5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 sm:p-6"
              onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">{section.icon}</div>
                <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
              </div>
              <ChevronDown
                className={`h-5 w-5 transform text-gray-400 transition-transform duration-300 ${
                  openSection === section.title ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {openSection === section.title && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4 px-4 py-5 sm:px-6 sm:pb-6">
                    {section.content.map((item, itemIndex) => (
                      <motion.div
                        key={item.subtitle}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                      >
                        <h3 className="text-sm font-semibold text-gray-900">{item.subtitle}</h3>
                        <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
