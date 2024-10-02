"use client";

import * as React from "react";
import { Cell, Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAlpacaQueries } from "@/hooks/use-alpaca.hook";
import { AlpacaAuction } from "@/types/alpaca.types";
import Loading from "../common/loading";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

interface PropsInterface {
  auctionData: AlpacaAuction[];
}

export function AuctionExchangeDistribution({ auctionData }: PropsInterface) {
  const { stocksExchangesQuery } = useAlpacaQueries();

  const { data, isFetching } = stocksExchangesQuery;

  const exchangeCounts = React.useMemo(() => {
    return auctionData.reduce(
      (counts, auction) => {
        auction?.o?.concat(auction?.c || []).forEach((auctionField) => {
          if (auctionField) {
            const exchange = data?.[auctionField.x] ?? auctionField.x;
            counts[exchange] = (counts[exchange] || 0) + 1;
          }
        });
        return counts;
      },
      {} as Record<string, number>,
    );
  }, [auctionData, data]);

  const chartData = React.useMemo(() => {
    return Object.entries(exchangeCounts).map(([exchange, count]) => ({
      exchange,
      count,
    }));
  }, [exchangeCounts]);

  const totalExchanges = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const chartConfig = chartData.reduce(
    (acc, { exchange }, index) => {
      acc[exchange] = {
        label: exchange,
        color: COLORS[index % COLORS.length],
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>,
  );

  if (isFetching) {
    return <Loading />;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Auction Exchange Distribution</CardTitle>
        <CardDescription>Distribution of exchanges in auctions</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="exchange"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalExchanges.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Exchanges
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing distribution of exchanges across all auctions
        </div>
      </CardFooter>
    </Card>
  );
}
