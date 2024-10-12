import { AlpacaAccountResponse } from "@/types/alpaca.types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function AccountOverview<T extends AlpacaAccountResponse>({
  account,
}: {
  account: T["account"];
}) {
  return (
    <Card>
      <CardHeader className="bg-gray-100 dark:bg-gray-800">
        <CardTitle>Account Overview</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Account Number
            </p>
            <p className="text-lg font-semibold">{account.account_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="text-lg font-semibold capitalize">{account.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Equity</p>
            <p className="text-lg font-semibold">
              ${parseFloat(account.equity).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cash</p>
            <p className="text-lg font-semibold">
              ${parseFloat(account.cash).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
