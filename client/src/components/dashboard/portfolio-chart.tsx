import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DashboardQueryResponse } from "@/types/alpaca.types";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function PortfolioChart<T extends DashboardQueryResponse>({
  data,
}: {
  data: T["portfolioHistory"];
}) {
  const chartData = data.timestamp.map((timestamp, index) => ({
    date: new Date(timestamp * 1000).toLocaleDateString(),
    equity: parseFloat(data.equity[index]),
    profitLoss: parseFloat(data.profit_loss[index]),
  }));

  return (
    <Card className="h-full w-full">
      <CardContent className="overflow-scroll p-0">
        <ChartContainer
          config={{
            equity: {
              label: "Equity",
              color: "hsl(var(--chart-1))",
            },
            profitLoss: {
              label: "Profit/Loss",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px] sm:h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="equity"
                stroke="var(--color-equity)"
                strokeWidth={2}
                dot={true}
              />
              <Line
                type="monotone"
                dataKey="profitLoss"
                stroke="var(--color-profitLoss)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
