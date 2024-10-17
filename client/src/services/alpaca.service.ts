import axiosInstance from "@/config/axios-instance";
import { AlpacaAccountResponse, AlpacaAsset, AlpacaSymbol, DashboardQueryResponse, PortfolioResponse } from "@/types/alpaca.types";

export const AlpacaService = {
  async getAccount() {
    try {
      const response = await axiosInstance.get<AlpacaAccountResponse>("/api/alpaca/account");
      return response.data;
    } catch (error: any) {
      console.info("Error getting account: ", error?.message);
      return null;
    }
  },
  async getAssets(page: number) {
    try {
      const response = await axiosInstance.get(
        `/api/alpaca/assets/page/${page}`,
      );
      return response.data;
    } catch (error: any) {
      console.info("Error getting assets: ", error?.message);
      return null;
    }
  },
  async getAllAssets() {
    try {
      const response = await axiosInstance.get(`/api/alpaca/assets/get`);
      return response.data;
    } catch (error: any) {
      console.info("Error getting assets: ", error?.message);
      return null;
    }
  },

  async getDashboardData(): Promise<DashboardQueryResponse | null> {
    try {
      const response = await axiosInstance.get<DashboardQueryResponse>("/api/alpaca/dashboard");
      return response.data;
    } catch (error: any) {
      console.info("Error getting dashboard data: ", error?.message);
      return null;
    }
  },

  async getPortfolioData(): Promise<PortfolioResponse | null> {
    try {
      const response = await axiosInstance.get<PortfolioResponse>("/api/alpaca/portfolio");
      return response.data;
    } catch (error: any) {
      console.info("Error getting portfolio data: ", error?.message);
      return null;
    }
  },

  async getSymbols(): Promise<AlpacaSymbol[]> {
    try {
      const response = await axiosInstance.get<AlpacaAsset[]>("/api/alpaca/assets/symbols");
      return response.data;
    } catch (error: any) {
      console.info("Error getting symbols: ", error?.message);
      return [];
    }
  }
};
