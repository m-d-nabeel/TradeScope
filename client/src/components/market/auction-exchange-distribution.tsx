import { AlpacaAuction } from "@/types/alpaca.types";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function AuctionExchangeDistribution({
  auctionData,
}: {
  auctionData: AlpacaAuction[];
}) {
  // Reduce to get counts of each exchange
  const exchangeCounts = auctionData.reduce(
    (counts, auction) => {
      // Combine the `o` (opening) and `c` (closing) auctions
      auction.o.concat(auction.c).forEach((auctionField) => {
        const exchange = auctionField?.x; // `x` is the exchange code
        counts[exchange] = (counts[exchange] || 0) + 1;
      });
      return counts;
    },
    {} as Record<string, number>
  ); // Record to track exchange counts

  // Map the exchangeCounts to chart data
  const chartData = Object.entries(exchangeCounts).map(([exchange, count]) => ({
    exchange,
    count,
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="exchange"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
