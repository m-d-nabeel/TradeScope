import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoaderData } from "@tanstack/react-router";
import { AuctionExchangeDistribution } from "./auction-exchange-distribution";
import { AuctionPriceChart } from "./auction-price-chart";
import { AuctionTimelineChart } from "./auction-timeline-chart";
import { AuctionSizeChart } from "./auctions-size-chart";

export default function TradeVisualisation() {
  const { symbol, auctionData } = useLoaderData({ from: "/_main/trade/" });

  console.log("symbol", symbol);
  console.log("auctionData", auctionData);

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
