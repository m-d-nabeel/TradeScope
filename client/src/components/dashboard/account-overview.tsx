import { DashboardQueryResponse } from "@/types/alpaca.types";
import { Card, CardContent } from "../ui/card";

export function AccountOverview<T extends DashboardQueryResponse>({
  account,
}: {
  account: T["account"];
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="mb-2 text-lg font-semibold">Account Overview</h2>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-muted-foreground">Account Number</dt>
            <dd className="text-sm font-semibold">{account.account_number}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
            <dd className="text-sm font-semibold">{account.status}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-muted-foreground">Cash Balance</dt>
            <dd className="text-sm font-semibold">${parseFloat(account.cash).toLocaleString()}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-muted-foreground">Portfolio Value</dt>
            <dd className="text-sm font-semibold">
              ${parseFloat(account.portfolio_value).toLocaleString()}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-muted-foreground">Buying Power</dt>
            <dd className="text-sm font-semibold">
              ${parseFloat(account.buying_power).toLocaleString()}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
