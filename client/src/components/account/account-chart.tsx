import { AlpacaAccountResponse } from "@/types/alpaca.types";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function AccountChart<T extends AlpacaAccountResponse>({
  activities,
}: {
  activities: T["accountActivities"];
}) {
  const data = activities
    .map((activity: any) => ({
      date: new Date(activity.date).toISOString().split("T")[0],
      value: parseFloat(activity.net_amount),
    }))
    .filter((entry: any) => !isNaN(entry.value));

  return (
    <Card>
      <CardHeader className="bg-gray-100 dark:bg-gray-800">
        <CardTitle>Account Value</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
