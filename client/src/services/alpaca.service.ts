import axiosInstance from "@/config/axios-instance";
import { AlpacaAccount } from "@/types/alpaca.types";

export const AlpacaService = {
  async getAccount() {
    try {
      const response = await axiosInstance.get("/api/alpaca/account");
      return response.data as AlpacaAccount;
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
};