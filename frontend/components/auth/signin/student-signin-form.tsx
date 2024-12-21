import React, { SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/auth-context";
import { LoaderBtn } from "@/components/loaders/loader-btn";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  studentSignInValidationSchema,
  StudentSignInValidationSchemaType,
} from "./schema/student-sigin-validation";

export const StudentSigninForm = ({
  setIsTeacherSigninForm,
}: {
  setIsTeacherSigninForm: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSignInValidationSchemaType>({
    resolver: zodResolver(studentSignInValidationSchema),
  });
  const { signIn } = useAuth();
  const user = useSelector((state: any) => state.account.user);

  const onSubmit: SubmitHandler<StudentSignInValidationSchemaType> = async (
    data
  ) => {
    setIsLoading(true);
    await signIn(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      toast.success('Đăng nhập thành công');
      redirect(`/${user.role}`);
    }
  }, [user])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl xl:text-3xl font-extrabold">
        Đăng nhập sinh viên
      </h1>
      <div className="w-full flex-1 mt-8">
        <div className="mx-auto max-w-xs">
        <input
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            type="email"
            placeholder="Email"
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
          <input
            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
            type="password"
            placeholder="Mật khẩu"
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
          <button
            type="submit"
            className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderBtn />
            ) : (
              <>
                <svg
                  className="w-6 h-6 -ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <path d="M20 8v6M23 11h-6" />
                </svg>
                <span className="ml-3">Đăng nhập</span>
              </>
            )}
          </button>
          <span className="block mt-6 text-sm text-gray-600 text-center">
            Đăng nhập dành cho{" "}
            <span
              className="font-bold cursor-pointer hover:opacity-90"
              onClick={() => setIsTeacherSigninForm(true)}
            >
              giảng viên
            </span>
          </span>
        </div>
      </div>
    </form>
  );
};
