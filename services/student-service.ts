import { AxiosInstance } from "@/config/axios-instance";

export const studentService = {
  getAllStudents: async () => {
    return await AxiosInstance.get("/students");
  },

  getStudentById: async (studentId: number) => {
    return await AxiosInstance.get(`/students/${studentId}`);
  },

  searchByName: async (studentName: string) => {
    return await AxiosInstance.get(`students/search-by-name`, {
      params: {
        student_name: studentName,
      },
    });
  },
};
