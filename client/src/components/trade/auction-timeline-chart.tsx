import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlpacaAuction } from "@/types/alpaca.types";
import { format } from "date-fns";
import React from "react";
import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "../ui/chart";

interface PropsInterface {
  auctionData: AlpacaAuction[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="h-fit w-fit border-border bg-background p-1 drop-shadow">
        <CardHeader className="p-0 pb-1">
          <CardTitle className="text-sm font-medium">
            {format(new Date(label), "MMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent className="m-0 h-fit w-fit p-0">
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm flex justify-stretch">
              <span className="font-medium" style={{ color: entry.color }}>
                {entry.name}:
              </span>
              <span className="ml-auto italic">${entry.value.toFixed(2)}</span>
            </p>
          ))}
        </CardContent>
      </Card>
    );
  }
  return null;
};

const chartConfig = {
  opening: {
    label: "Opening Auction",
    color: "hsl(var(--chart-1))",
  },
  closing: {
    label: "Closing Auction",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AuctionTimelineChart({ auctionData }: PropsInterface) {
  const chartData = React.useMemo(() => {
    return auctionData.map((auction) => ({
      date: new Date(auction.d).getTime(),
      openingPrice: auction?.o?.[0]?.p || null,
      closingPrice: auction?.c?.[0]?.p || null,
    }));
  }, [auctionData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Auction Price Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              type="number"
              domain={["auto", "auto"]}
              tickFormatter={(tick) => format(new Date(tick), "MMM d, yyyy")}
              className="text-xs"
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(tick) => `$${tick.toFixed(2)}`}
              className="text-xs"
            />
            <ChartTooltip
              content={<CustomTooltip />}
              cursor={false}
              defaultIndex={1}
            />

            <Legend />
            <Area
              type="monotone"
              dataKey="openingPrice"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.3}
              name="Opening Auction"
              connectNulls
            />
            <Area
              type="monotone"
              dataKey="closingPrice"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.3}
              name="Closing Auction"
              connectNulls
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
