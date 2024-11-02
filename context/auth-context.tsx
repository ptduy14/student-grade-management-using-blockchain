"use client";
import { createContext, useContext } from "react";
import { TeacherSignInValidationSchemaType } from "@/components/auth/signin/schema/teacher-sigin-validation-schema";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useDispatch } from "react-redux";
import { AuthService } from "@/services/auth-service";
import { setUser } from "@/redux/slices/userSlice";

const AuthContext = createContext<undefined | AuthContextValueType>(undefined);

interface AuthContextValueType {
  signIn: (data: TeacherSignInValidationSchemaType) => Promise<boolean>;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  const signIn = async (data: TeacherSignInValidationSchemaType) => {
    try {
      const response = await AuthService.signIn(data);
      // set cookie
      await AuthService.setAuthCookie(response.data);
      dispatch(setUser(response.data));
      return true;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }

      return false;
    }
  };

  const AuthContextValue: AuthContextValueType = {
    signIn,
  };

  return (
    <AuthContext.Provider value={AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
