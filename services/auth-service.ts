import { AxiosInstance } from "../config/axios-instance";
import { TeacherSignInValidationSchemaType } from "@/components/auth/signin/schema/teacher-sigin-validation-schema";
import axios from "axios";

export const AuthService = {
  signIn: async (payload: TeacherSignInValidationSchemaType) => {
    return await AxiosInstance.post("/auth/login", payload);
  },

  setAuthCookie: async (authPayload: any) => {
    return await axios.post("/api/auth/set-auth-cookie", authPayload);
  },

  removeAuthCookie: async () => {
    return await axios.post("/api/auth/remove-auth-cookie");
  },

  checkWalletAddress: async () => {
    return await AxiosInstance.get("/auth/teacher/check-wallet-address");
  },

  addWalletAddress: async (walletAddress: string) => {
    const payload = {
      wallet_address: walletAddress,
    };

    return await AxiosInstance.post(
      "/auth/teacher/add-wallet-address",
      payload
    );
  },
};
