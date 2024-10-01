import { AlpacaAuction } from "@/types/alpaca.types";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AuctionTimelineChart({
  auctionData,
}: {
  auctionData: AlpacaAuction[];
}) {
  const chartData = auctionData.flatMap((auction) =>
    auction?.o?.concat(auction?.c || []).map((a) => ({
      time: new Date(a?.t).getTime(),
      price: a?.p,
      type: auction?.o?.includes(a) ? "Opening" : "Closing",
    }))
  );

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          domain={["auto", "auto"]}
          name="Time"
          tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
          type="number"
        />
        <YAxis dataKey="price" name="Price" />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          formatter={(value, name) => [
            value,
            name === "time"
              ? new Date(value.toString()).toLocaleString()
              : name,
          ]}
        />
        <Legend />
        <Scatter
          name="Opening Auction"
          data={chartData.filter((d) => d?.type === "Opening")}
          fill="#8884d8"
        />
        <Scatter
          name="Closing Auction"
          data={chartData.filter((d) => d?.type === "Closing")}
          fill="#82ca9d"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
