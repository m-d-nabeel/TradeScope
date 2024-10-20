import { PortfolioResponse } from "@/types/alpaca.types";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function PortfolioChart<T extends PortfolioResponse>({
  data,
}: {
  data: T["portfolioHistory"];
}) {
  const chartData = data.equity.map((eq, index) => ({
    timestamp: new Date(data.timestamp[index] * 1000).toLocaleString(),
    equity: parseFloat(eq),
  }));

  return (
    <div className="h-[400px] rounded-lg bg-white p-4 shadow-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="timestamp"
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            labelStyle={{ color: "#374151", fontWeight: "bold" }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Equity"]}
          />
          <Line
            type="monotone"
            dataKey="equity"
            stroke="url(#colorGradient)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 8, fill: "#8B5CF6" }}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
