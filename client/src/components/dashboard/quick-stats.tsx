import { DashboardQueryResponse } from "@/types/alpaca.types";
import { motion } from "framer-motion";
import { Activity, BarChart2, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export function QuickStats<T extends DashboardQueryResponse>({
  account,
}: {
  account: T["account"];
}) {
  const stats = [
    {
      title: "Cash Balance",
      value: account.cash,
      icon: DollarSign,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Portfolio Value",
      value: account.portfolio_value,
      icon: BarChart2,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Buying Power",
      value: account.buying_power,
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Account Status",
      value: account.status,
      icon: Activity,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="mb-2 text-lg font-semibold">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center rounded-lg p-2"
            >
              <div className={`${stat.color} mb-2 rounded-full p-2`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <h3 className="text-center text-sm font-medium">{stat.title}</h3>
              <p className="text-sm font-bold">
                {stat.title.includes("Cash") ||
                stat.title.includes("Value") ||
                stat.title.includes("Power")
                  ? `$${parseFloat(stat.value).toLocaleString()}`
                  : stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
