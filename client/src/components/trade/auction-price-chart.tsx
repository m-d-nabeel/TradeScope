import { AlpacaAuction } from "@/types/alpaca.types";
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

export function AuctionPriceChart({
  auctionData,
}: {
  auctionData: AlpacaAuction[];
}) {
  const chartData = auctionData.map((auction) => {
    if (!auction) {
      return {};
    }
    return {
      date: auction.d,
      openingPrice: auction?.o?.[0].p,
      closingPrice: auction?.c?.[0].p,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="openingPrice"
          stroke="#8884d8"
          name="Opening Price"
        />
        <Line
          type="monotone"
          dataKey="closingPrice"
          stroke="#82ca9d"
          name="Closing Price"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
