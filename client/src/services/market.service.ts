import axiosInstance from "@/config/axios-instance";
import qs from "qs";

interface AlpacaMarketBars {
  symbols: string[];
  timeframe?: string;
  limit?: number;
  start: string;
  end?: string;
}

interface AlpacaMarketAuctions {
  symbols: string[];
  start: string;
  end?: string;
}

export const AlpacaMarketService = {
  async getBars({ symbols, timeframe, limit, start, end }: AlpacaMarketBars) {
    try {
      const query = qs.stringify({
        symbols: symbols.join(","),
        timeframe,
        limit,
        start,
        end,
      });
      console.log("Query: ", query);
      const response = await axiosInstance.get(`/api/alpaca/market/bars?${query}`);
      return response.data;
    } catch (error: any) {
      console.info("Error getting bars: ", error?.message);
      return null;
    }
  },
  async getAuctions({ symbols, start, end }: AlpacaMarketAuctions) {
    try {
      const query = qs.stringify({
        symbols: symbols.join(","),
        start,
        end,
      });
      const response = await axiosInstance.get(`/api/alpaca/market/auctions?${query}`);
      return response.data;
    } catch (error: any) {
      console.info("Error getting auctions: ", error?.message);
      return null;
    }
  },

  async getStocksExchanges(): Promise<Record<string, string>> {
    try {
      const response = await axiosInstance.get("/api/alpaca/market/stocks/exchanges");
      return response.data;
    } catch (error: any) {
      console.info("Error getting stocks exchanges: ", error?.message);
      return {};
    }
  },
};
