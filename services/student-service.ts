import { AxiosInstance } from "@/config/axios-instance"

export const studentService = {
    getStudentById: async(studentId: number) => {
        return await AxiosInstance.get(`/students/${studentId}`);
    }
}