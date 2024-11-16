import { AxiosInstance } from "@/config/axios-instance"

export const studentEnrollmentService = {
    getAllStudentEnrollments: async() => {
        return await AxiosInstance.get("/student-enrollment/student/semesters");
    },

    enrollmentStudent: async(payload: any) => {
        return await AxiosInstance.post("student-enrollment/admin/enroll", payload);
    }
}