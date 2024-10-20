import { useDashboardQueries } from "@/hooks/use-alpaca.hook";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AccountOverview } from "./account-overview";
import { PortfolioChart } from "./portfolio-chart";
import { QuickStats } from "./quick-stats";
import { RecentActivity } from "./recent-activity";

export default function TradingDashboard() {
  const { dashboardQuery } = useDashboardQueries();
  const { data } = dashboardQuery;

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl font-bold text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-2 dark:from-blue-900 dark:to-purple-900 sm:p-4">
      <div className="mx-auto max-w-7xl space-y-2 sm:space-y-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full p-4 lg:w-2/3">
                <div className="h-[300px] sm:h-[400px]">
                  <PortfolioChart data={data.portfolioHistory} />
                </div>
              </div>
              <div className="w-full space-y-4 border-t border-gray-200 p-4 dark:border-gray-700 lg:w-1/3 lg:border-l lg:border-t-0">
                <AccountOverview account={data.account} />
                <QuickStats account={data.account} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <RecentActivity activities={data.accountHistory} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
