import { AlpacaAccountResponse } from "@/types/alpaca.types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function BuyingPowerCard<T extends AlpacaAccountResponse>({
  account,
}: {
  account: T["account"];
}) {
  return (
    <Card>
      <CardHeader className="bg-gray-100 dark:bg-gray-800">
        <CardTitle>Buying Power</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Buying Power
            </p>
            <p className="text-2xl font-bold">
              ${parseFloat(account.buying_power).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Day Trading Buying Power
            </p>
            <p className="text-lg font-semibold">
              ${parseFloat(account.daytrading_buying_power).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Non-Marginable Buying Power
            </p>
            <p className="text-lg font-semibold">
              $
              {parseFloat(account.non_marginable_buying_power).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
