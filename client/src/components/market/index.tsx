import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const MarketDataVisualization = ({ symbol = "GOOGL" }) => {
  const [timeframe, setTimeframe] = useState("1D");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const options = {
          method: "GET",
          url: "https://data.alpaca.markets/v2/stocks/bars?symbols=GOOGL&timeframe=12M&start=2022-01-03T00%3A00%3A00Z&limit=1000&adjustment=raw&feed=sip&sort=asc",
          headers: {
            accept: "application/json",
            "APCA-API-KEY-ID": "PKPWTS57Z5YPEAD70FKZ",
            "APCA-API-SECRET-KEY": "bceKwVKML416mGsf354nbTePJbBce9oOClT8IKbW",
          },
        };

        axios
          .request(options)
          .then(function (response) {
            console.log(response.data);
            const data = response.data;
            const processedData = data.bars[symbol].map((bar: any) => ({
              date: new Date(bar.t).toLocaleDateString(),
              open: bar.o,
              high: bar.h,
              low: bar.l,
              close: bar.c,
              volume: bar.v,
              vwap: bar.vw,
            }));
            setChartData(processedData);
          })
          .catch(function (error) {
            console.error(error);
          });
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    fetchMarketData();
  }, [symbol, timeframe]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{symbol} Market Data</CardTitle>
        <div className="flex space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1D">1 Day</SelectItem>
              <SelectItem value="1W">1 Week</SelectItem>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Refresh</Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#8884d8"
              yAxisId="left"
            />
            <Line
              type="monotone"
              dataKey="vwap"
              stroke="#82ca9d"
              yAxisId="left"
            />
            <Bar dataKey="volume" fill="#413ea0" yAxisId="right" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MarketDataVisualization;
