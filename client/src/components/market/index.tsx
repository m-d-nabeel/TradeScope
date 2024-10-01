import { useAlpacaQueries } from "@/hooks/use-alpaca.hook";
import Loading from "../common/loading";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export function MarketAssets() {
  const { assetsQuery } = useAlpacaQueries();
  const { data, isFetching } = assetsQuery;

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-indigo-100 px-4 dark:from-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-7xl">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
