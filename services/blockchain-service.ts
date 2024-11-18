import { AxiosInstance } from "@/config/axios-instance"
import { PreviousDataScore } from "@/interfaces/PreviousDataScore"

export const BlockchainService = {
    listenTransaction: async(previousDataScore: PreviousDataScore) => {
        return AxiosInstance.post("/blockchain/listern-transaction", previousDataScore);
    }
}