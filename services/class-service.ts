import { AxiosInstance } from "@/config/axios-instance";

export const classService = {
  getAllClasses: async () => {
    return AxiosInstance.get("/classes");
  },
  getAllStudents: async (id: string) => {
    return AxiosInstance.get(`/classes/${id}`);
  },
};
