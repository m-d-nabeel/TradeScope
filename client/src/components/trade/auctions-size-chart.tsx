import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlpacaAuction } from "@/types/alpaca.types";
import { format, parseISO } from "date-fns";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
} from "../ui/chart";
import { CustomTooltip } from "./custom-tooltip";

interface PropsInterface {
  auctionData: AlpacaAuction[];
}

const chartConfig = {
  opening: {
    label: "Opening Auction Size",
    color: "hsl(var(--chart-1))",
  },
  closing: {
    label: "Closing Auction Size",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const formatYAxis = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

export function AuctionSizeChart({ auctionData }: PropsInterface) {
  const chartData = React.useMemo(() => {
    return auctionData.map((auction) => ({
      date: auction?.d,
      openingSize: auction?.o?.reduce((sum, a) => sum + a?.s, 0) || 0,
      closingSize: auction?.c?.reduce((sum, a) => sum + a?.s, 0) || 0,
    }));
  }, [auctionData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Auction Size Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted-foreground/20"
            />
            <XAxis
              dataKey="date"
              tickFormatter={(tick) => format(parseISO(tick), "MMM d")}
              interval="preserveStartEnd"
              minTickGap={50}
              className="text-xs text-muted-foreground"
            />
            <YAxis
              tickFormatter={formatYAxis}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip
              content={<CustomTooltip />}
              defaultIndex={1}
              cursor={false}
            />
            <ChartLegend />
            <Area
              type="monotone"
              dataKey="openingSize"
              stackId="1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.5}
              name="Opening Auction Size"
            />
            <Area
              type="monotone"
              dataKey="closingSize"
              stackId="1"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.5}
              name="Closing Auction Size"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
