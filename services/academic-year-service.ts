import { AxiosInstance } from "../config/axios-instance"

export const acdemicYearService = {
    getAllAcademicYear: async () => {
        return await AxiosInstance.get('/academic-years');
    },

    getDetailAcademicYear: async (academicYearId: string) => {
        return await AxiosInstance.get(`/academic-years/${academicYearId}`)
    }
}