import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlpacaAuction } from "@/types/alpaca.types";
import { format, parseISO } from "date-fns";
import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartTooltip } from "../ui/chart";
import { CustomTooltip } from "./custom-tooltip";

interface PropsInterface {
  auctionData: AlpacaAuction[];
}

const chartConfig = {
  opening: {
    label: "Opening Price",
    color: "hsl(var(--chart-1))",
  },
  closing: {
    label: "Closing Price",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AuctionPriceChart({ auctionData }: PropsInterface) {
  const chartData = React.useMemo(() => {
    return auctionData
      .map((auction) => ({
        date: auction.d,
        openingPrice: auction.o?.[0]?.p,
        closingPrice: auction.c?.[0]?.p,
      }))
      .filter((data) => data.openingPrice && data.closingPrice);
  }, [auctionData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Auction Price Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
            <XAxis
              dataKey="date"
              tickFormatter={(tick) => format(parseISO(tick), "MMM d")}
              interval={"preserveStartEnd"}
              minTickGap={50}
              className="text-xs text-muted-foreground"
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(tick) => `$${tick.toFixed(2)}`}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip content={<CustomTooltip />} defaultIndex={1} cursor={false} />
            <ChartLegend />
            <Line
              type="monotone"
              dataKey="openingPrice"
              stroke="#8884d8"
              name="Opening Price"
              dot={{ r: 1 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="closingPrice"
              stroke="#82ca9d"
              name="Closing Price"
              dot={{ r: 1 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
