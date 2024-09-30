import { AlpacaAuction } from "@/types/alpaca.types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function AuctionSizeChart({
  auctionData,
}: {
  auctionData: AlpacaAuction[];
}) {
  const chartData = auctionData.map((auction) => ({
    date: auction?.d,
    openingSize: auction?.o?.reduce((sum, a) => sum + a?.s, 0),
    closingSize: auction?.c?.reduce((sum, a) => sum + a?.s, 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="openingSize" fill="#8884d8" name="Opening Auction Size" />
        <Bar dataKey="closingSize" fill="#82ca9d" name="Closing Auction Size" />
      </BarChart>
    </ResponsiveContainer>
  );
}
