import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const RecentTrades = () => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Symbol</th>
              <th className="text-left">Type</th>
              <th className="text-left">Quantity</th>
              <th className="text-left">Price</th>
              <th className="text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AAPL</td>
              <td>Buy</td>
              <td>10</td>
              <td>$150.00</td>
              <td>2023-07-01</td>
            </tr>
            <tr>
              <td>GOOGL</td>
              <td>Sell</td>
              <td>5</td>
              <td>$2,500.00</td>
              <td>2023-06-30</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
