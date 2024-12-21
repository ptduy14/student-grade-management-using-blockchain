import { AxiosInstance } from "@/config/axios-instance"

export const ScoreService = {
    add: async(scoreSubmission: ScoreSubmission) => {
        return await AxiosInstance.post('/scores/add', scoreSubmission);
    },

    update: async(scoreSubmission: ScoreSubmission) => {
        return await AxiosInstance.patch('/scores/update', scoreSubmission);
    },
}