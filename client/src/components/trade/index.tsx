import { useSearch } from '@tanstack/react-router'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FilterMenu } from './filter-menu'
import { Loading } from '@/components/common/loading'
import { ErrorComponent } from '@/components/common/error-component'
import { AuctionPriceChart } from './auction-price-chart'
import { AuctionExchangeDistribution } from './auction-exchange-distribution'
import { useMarketQueries } from '@/hooks/use-alpaca.hook'
import { InitialFilterModal } from './initial-modal'
import { AuctionSizeChart } from './auctions-size-chart'

type SearchQuery = {
  symbols: string
  startDate: string
  endDate: string
  name: string
}

export default function TradeVisualisation() {
  const searchQuery: SearchQuery = useSearch({ from: "/_main/trade/" })
  const symbolArray = searchQuery.symbols ? searchQuery.symbols.split(",") : []
  const nameQuery = searchQuery?.name

  const { auctionQuery } = useMarketQueries({
    symbols: symbolArray.length > 0 ? symbolArray : ["AAPL"],
    start: searchQuery.startDate,
    end: searchQuery?.endDate,
  })
  const { data, isSuccess, isLoading } = auctionQuery
  const auctionData = data?.auctions?.[symbolArray[0]]

  if (isLoading) {
    return <Loading />
  }

  if (!isSuccess) {
    return <ErrorComponent mode="light" error={Error("Failed to fetch auction data")} />
  }

  if (!auctionData && symbolArray.length > 0) {
    return (
      <ErrorComponent
        mode="light"
        error={Error("No auction data found for the selected symbol " + symbolArray[0])}
      />
    )
  }

  return (
    <>
      <InitialFilterModal />

      {searchQuery.symbols && searchQuery.startDate && auctionData && (
        <Card className="mx-auto my-2 w-full max-w-4xl">
          <CardHeader className="relative">
            <CardTitle>{symbolArray[0]} Auction Data Analysis</CardTitle>
            <CardDescription>{nameQuery}</CardDescription>
            <div className="absolute right-4 top-4">
              <FilterMenu />
            </div>
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
      )}
    </>
  )
}
