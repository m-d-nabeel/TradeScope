import { useAlpacaQueries } from "@/hooks/use-alpaca.hook";
import { AccountActivities } from "./account-activities";
import { AccountChart } from "./account-chart";
import { AccountConfig } from "./account-config";
import { AccountOverview } from "./account-overview";
import { BuyingPowerCard } from "./buying-power-card";

export default function AccountDashboard() {
  const { accountQuery } = useAlpacaQueries();
  const { data: accountData } = accountQuery;

  if (!accountData) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 transition-colors duration-200 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AccountOverview account={accountData.account} />
          <BuyingPowerCard account={accountData.account} />
          <AccountConfig config={accountData.accountConfigs} />
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <AccountChart activities={accountData.accountActivities} />
          <AccountActivities activities={accountData.accountActivities} />
        </div>
      </div>
    </div>
  );
}
