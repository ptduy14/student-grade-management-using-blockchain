import { AxiosInstance } from "../config/axios-instance"
import { TeacherSignInValidationSchemaType } from "@/components/auth/signin/schema/teacher-sigin-validation-schema";
import axios from "axios";

export const AuthService = {
    signIn: async(payload: TeacherSignInValidationSchemaType) => {
        return await AxiosInstance.post("/auth/login", payload);
    },

    setAuthCookie: async(authPayload: any) => {
        return await axios.post('/api/auth/set-auth-cookie', authPayload);
    },

    removeAuthCookie: async() => {
        return await axios.post('/api/auth/remove-auth-cookie');
    }
}