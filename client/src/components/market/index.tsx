import { useAlpacaQueries } from "@/hooks/use-alpaca.hook";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export function MarketAssets() {
  const { assetsQuery } = useAlpacaQueries();
  const { data, isFetching, isLoading } = assetsQuery;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isFetching) {
    return <div>Fetching...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-indigo-100 dark:from-gray-800 dark:to-gray-900 px-4">
      <div className="max-w-7xl mx-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
