import { AxiosInstance } from "@/config/axios-instance";

export const transactionHistoryService = {
  getLatesTranstractionHistory: async () => {
    return AxiosInstance.get("/transaction-history");
  },

  getTransactionHistoriesByScoreId: async (scoreId: number) => {
    return AxiosInstance.get(`/transaction-history/scores/${scoreId}`);
  },
};
