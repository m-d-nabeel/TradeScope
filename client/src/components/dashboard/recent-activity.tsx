import { DashboardQueryResponse } from "@/types/alpaca.types";
import { Card, CardContent } from "../ui/card";

export function RecentActivity<T extends DashboardQueryResponse>({
  activities,
}: {
  activities: T["accountHistory"];
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="mb-2 text-lg font-semibold">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-muted-foreground">
                <th className="p-2">Date</th>
                <th className="p-2">Activity Type</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 text-sm">{activity.date}</td>
                  <td className="p-2 text-sm">{activity.activity_type}</td>
                  <td className="p-2 text-sm">
                    ${parseFloat(activity.net_amount).toLocaleString()}
                  </td>
                  <td className="p-2 text-sm">{activity.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
