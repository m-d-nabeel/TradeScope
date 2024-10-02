import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlpacaAuction } from "@/types/alpaca.types";
import { format, parseISO } from "date-fns";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PropsInterface {
  auctionData: AlpacaAuction[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Card className="border-border bg-background">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {format(parseISO(label), "MMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm">
              <span className="font-medium" style={{ color: entry.color }}>
                {entry.name}:
              </span>{" "}
              ${entry.value.toFixed(2)}
            </p>
          ))}
        </CardContent>
      </Card>
    );
  }
  return null;
};

export function AuctionPriceChart({ auctionData }: PropsInterface) {
  const chartData = React.useMemo(() => {
    return auctionData
      .map((auction) => ({
        date: auction.d,
        openingPrice: auction?.o?.[0]?.p,
        closingPrice: auction?.c?.[0]?.p,
      }))
      .filter((data) => data.openingPrice && data.closingPrice);
  }, [auctionData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Auction Price Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted-foreground/20"
            />
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
            <Tooltip content={<CustomTooltip />} />
            <Legend />
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
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
