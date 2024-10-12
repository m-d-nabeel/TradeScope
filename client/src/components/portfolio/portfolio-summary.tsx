import { PortfolioResponse } from "@/types/alpaca.types";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

export function PortfolioSummary<T extends PortfolioResponse>({
  data,
}: {
  data: T["portfolioHistory"];
}) {
  const latestEquity = parseFloat(data.equity[data.equity.length - 1]);
  const latestProfitLoss = parseFloat(
    data.profit_loss[data.profit_loss.length - 1],
  );
  const latestProfitLossPct = parseFloat(
    data.profit_loss_pct[data.profit_loss_pct.length - 1],
  );

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <motion.h2
        className="mb-2 text-4xl font-bold text-gray-800"
        key={latestEquity}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        ${latestEquity.toLocaleString()}
      </motion.h2>
      <motion.div
        className={`flex items-center text-lg font-semibold ${latestProfitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
        key={latestProfitLoss}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {latestProfitLoss >= 0 ? (
          <ChevronUp className="mr-1" />
        ) : (
          <ChevronDown className="mr-1" />
        )}
        <span>${Math.abs(latestProfitLoss).toLocaleString()}</span>
        <span className="ml-2 text-sm text-gray-600">
          ({latestProfitLossPct.toFixed(2)}%)
        </span>
      </motion.div>
    </div>
  );
}
