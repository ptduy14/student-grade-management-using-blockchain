import { AxiosInstance } from "@/config/axios-instance"

export const transactionHistoryService = {
    getTransactionHistoriesByScoreId: async(scoreId: number) => {
        return AxiosInstance.get(`transaction-history/scores/${scoreId}`);
    }
}