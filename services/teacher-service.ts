import { AxiosInstance } from "@/config/axios-instance";

export const TeacherService = {
  getAllTeachers: async () => {
    return await AxiosInstance.get("/teachers");
  },

  searchByName: async (teacherName: string) => {
    return await AxiosInstance.get("/teachers/search-by-name", {
      params: {
        teacher_name: teacherName,
      },
    });
  },

  searchByWalletAdrress: async (walletAddress: string) => {
    return await AxiosInstance.get("/teachers/search-by-wallet-address", {
      params: {
        wallet_address: walletAddress,
      },
    });
  },
};
