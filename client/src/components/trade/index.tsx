import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMarketQueries } from "@/hooks/use-alpaca.hook";
import { useSearch } from "@tanstack/react-router";
import { AuctionExchangeDistribution } from "./auction-exchange-distribution";
import { AuctionPriceChart } from "./auction-price-chart";
import { AuctionTimelineChart } from "./auction-timeline-chart";
import { AuctionSizeChart } from "./auctions-size-chart";

interface SearchQuery {
  symbols: string;
}

export default function TradeVisualisation() {
  const search: SearchQuery | undefined = useSearch({ from: "/_main/trade/" });
  const symbols = search?.symbols?.split(",") ?? ["AAPL"];
  const symbol = symbols[0];

  const { auctionQuery } = useMarketQueries({
    symbols: symbols,
    start: new Date("2023-01-01").toISOString(),
  });

  const { data } = auctionQuery;
  const auctionData = data?.auctions?.[symbol];

  if (!auctionData) {
    return (
      <Card className="mx-auto my-2 w-full max-w-4xl">
        <CardHeader>
          <CardTitle>{symbol} Auction Data Analysis</CardTitle>
          <CardDescription>
            No auction data found for {symbol} stock
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mx-auto my-2 w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{symbol} Auction Data Analysis</CardTitle>
        <CardDescription>
          Visualizing auction data for {symbol} stock
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="price">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="price">Price</TabsTrigger>
            <TabsTrigger value="size">Size</TabsTrigger>
            <TabsTrigger value="exchange">Exchange</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
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
          <TabsContent value="timeline">
            <AuctionTimelineChart auctionData={auctionData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
