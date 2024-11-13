import { AxiosInstance } from "@/config/axios-instance"

export const semesterService = {
    getSemesterById: async (semesterId: string) => {
        return await AxiosInstance.get(`/semesters/${semesterId}`);
    },

    getCurrentOpenSemester: async () => {
        return await AxiosInstance.get('/semesters/current-open-semester');
    },

    completeSemester: async (semesterId: string) => {
        return await AxiosInstance.get(`/semesters/${semesterId}/complete`);
    }
}