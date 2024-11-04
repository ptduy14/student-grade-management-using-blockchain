import { AxiosInstance } from "@/config/axios-instance"

export const semesterService = {
    getSemesterById: async (semesterId: string) => {
        return await AxiosInstance.get(`/semesters/${semesterId}`);
    }
}