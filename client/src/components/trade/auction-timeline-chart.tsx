import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlpacaAuction } from "@/types/alpaca.types";
import { format } from "date-fns";
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
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
            {format(new Date(label), "MMM d, yyyy")}
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
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
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
            <Tooltip content={<CustomTooltip />} />
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
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
