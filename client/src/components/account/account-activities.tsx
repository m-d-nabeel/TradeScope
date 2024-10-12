import { AlpacaAccountResponse } from "@/types/alpaca.types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export function AccountActivities<T extends AlpacaAccountResponse>({
  activities,
}: {
  activities: T["accountActivities"];
}) {
  return (
    <Card>
      <CardHeader className="bg-gray-100 dark:bg-gray-800">
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Net Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  {new Date(activity.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{activity.activity_type}</TableCell>
                <TableCell>{activity.symbol}</TableCell>
                <TableCell>{activity.qty}</TableCell>
                <TableCell>${parseFloat(activity.price).toFixed(2)}</TableCell>
                <TableCell>
                  ${parseFloat(activity.net_amount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
