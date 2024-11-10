import { AxiosInstance } from "@/config/axios-instance"

export const studentEnrollmentService = {
    getAllStudentEnrollments: () => {
        return AxiosInstance.get("/student-enrollment/student/semesters");
    }
}