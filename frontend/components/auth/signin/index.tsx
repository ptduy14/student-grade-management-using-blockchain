"use client";
import Image from "next/image";
import LogoCTUET from "../../../public/logo_ctuet.png";
import { useState } from "react";
import { TeacherSigninForm } from "./teacher-signin-from";
import { StudentSigninForm } from "./student-signin-form";

export const Signin = () => {
  const [isTeacherSigninForm, setIsTeacherSigninForm] = useState<boolean>(true);

  const renderSigninForm = () => {
    if (isTeacherSigninForm) {
      return <TeacherSigninForm setIsTeacherSigninForm={setIsTeacherSigninForm}/>;
    }

    return <StudentSigninForm setIsTeacherSigninForm={setIsTeacherSigninForm}/>;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div>
            <Image
              src={LogoCTUET}
              className="w-32 mx-auto"
              alt="Logo CTUET"
            />
          </div>
          <div className="mt-12 flex flex-col items-center">
            {renderSigninForm()}
          </div>
        </div>
      </div>
    </div>
  );
};
