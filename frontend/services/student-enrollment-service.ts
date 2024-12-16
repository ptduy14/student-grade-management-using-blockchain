import { AxiosInstance } from "@/config/axios-instance"

export const studentEnrollmentService = {
    getAllAcademicResults: async() => {
        return await AxiosInstance.get("/student-enrollment/student/results");
    },

    getAllAcademicResultsByStudentId: async(studentId: string) => {
        return await AxiosInstance.get(`/student-enrollment/admin/students/${studentId}/results`);
    },

    enrollmentStudent: async(payload: any) => {
        return await AxiosInstance.post("student-enrollment/admin/register", payload);
    }
}