import { AxiosInstance } from "@/config/axios-instance"

export const TeacherService = {
    getAllTeachers: async() => {
        return await AxiosInstance.get("/teachers");
    }
}