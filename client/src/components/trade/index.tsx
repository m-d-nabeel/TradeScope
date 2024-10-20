import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarketQueries } from "@/hooks/use-alpaca.hook";
import { useSearch } from "@tanstack/react-router";
import { ErrorComponent } from "../common/error-component.tsx";
import {Loading} from "../common/loading.tsx";
import { AuctionExchangeDistribution } from "./auction-exchange-distribution";
import { AuctionPriceChart } from "./auction-price-chart";
import { AuctionSizeChart } from "./auctions-size-chart";
import { FilterMenu } from "./filter-menu.tsx";

interface SearchQuery {
  symbols: string;
  startDate: string;
  endDate?: string;
  name?: string;
}

export default function TradeVisualisation() {
  const searchQuery: SearchQuery = useSearch({ from: "/_main/trade/" });
  const symbolArray = searchQuery.symbols.split(",");
  const nameQuery = searchQuery?.name;

  console.log("searchQuery", searchQuery);

  const { auctionQuery } = useMarketQueries({
    symbols: searchQuery?.symbols?.split(",") ?? ["AAPL"],
    start: searchQuery.startDate,
    end: searchQuery?.endDate,
  });
  const { data, isSuccess, isLoading } = auctionQuery;
  const auctionData = data?.auctions?.[symbolArray[0]];

  /**************************************************/
  /************* UI rendering logic here ************/
  /**************************************************/

  if (isLoading) {
    return <Loading />;
  }

  if (!isSuccess) {
    return <ErrorComponent mode="light" error={Error("Failed to fetch auction data")} />;
  }

  if (!auctionData) {
    return (
      <ErrorComponent
        mode="light"
        error={Error("No auction data found for the selected symbol " + symbolArray[0])}
      />
    );
  }

  return (
    <Card className="mx-auto my-2 w-full max-w-4xl">
      <CardHeader className="relative">
        <CardTitle>{symbolArray[0]} Auction Data Analysis</CardTitle>
        <CardDescription>{nameQuery}</CardDescription>
        <FilterMenu />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="price">Price</TabsTrigger>
            <TabsTrigger value="size">Size</TabsTrigger>
            <TabsTrigger value="exchange">Exchange</TabsTrigger>
          </TabsList>
          <TabsContent value="price">
            <AuctionPriceChart auctionData={auctionData} />
          </TabsContent>
          <TabsContent value="size">
            <AuctionSizeChart auctionData={auctionData} />
          </TabsContent>
          <TabsContent value="exchange">
            <AuctionExchangeDistribution auctionData={auctionData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
