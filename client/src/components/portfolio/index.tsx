import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardQueries } from "@/hooks/use-alpaca.hook";
import { PortfolioChart } from "./portfolio-chart";
import { PortfolioSummary } from "./portfolio-summary";

export function PortfolioDashboard() {
  const { portfolioQuery } = useDashboardQueries();
  const { data } = portfolioQuery;

  if (!data) return <div>Loading...</div>;

  return (
    <Card className="mx-auto w-full max-w-4xl bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">Portfolio Dashboard</CardTitle>
        <CardDescription className="text-gray-600">
          Your investment performance at a glance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <PortfolioSummary data={data.portfolioHistory} />
        <PortfolioChart data={data.portfolioHistory} />
      </CardContent>
    </Card>
  );
}
