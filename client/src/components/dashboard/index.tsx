import { AccountInformation } from "./account-information";
import { RecentTrades } from "./recent-trades";

export default function DashboardHome() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
      <AccountInformation />
      <RecentTrades />
    </div>
  );
}
