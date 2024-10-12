import { AlpacaAccountResponse } from "@/types/alpaca.types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";

export function AccountConfig<T extends AlpacaAccountResponse>({
  config,
}: {
  config: T["accountConfigs"];
}) {
  return (
    <Card>
      <CardHeader className="bg-gray-100 dark:bg-gray-800">
        <CardTitle>Account Configuration</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              DTBP Check
            </span>
            <span className="text-sm font-semibold">{config.dtbp_check}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              No Shorting
            </span>
            <Switch checked={config.no_shorting} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Trade Confirm Email
            </span>
            <span className="text-sm font-semibold">
              {config.trade_confirm_email}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Trade Suspended
            </span>
            <Switch checked={config.trade_suspended_by_user} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
