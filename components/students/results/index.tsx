"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { IStudentResult } from "@/interfaces/StudentResult";
import { studentEnrollmentService } from "@/services/student-enrollment-service";
import { TableWrapper } from "./table/table";

export const StudentResults = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [studentResults, setStudentResults] = useState<IStudentResult[]>([]);

  const getAllStudentEnrollments = async () => {
    const res = await studentEnrollmentService.getAllStudentEnrollments();
    setStudentResults(res.data);
    setIsFetching(false);
  };

  useEffect(() => {
    getAllStudentEnrollments();
  }, []);

  if (isFetching)
    return (
      <div className="w-full h-full flex justify-center items-center">
        Waiting...
      </div>
    );

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Trang chủ</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <span>Kết quả học tập</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Kết quả học tập</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full space-y-6">
        {studentResults.map((studentResult: IStudentResult) => (
          <div key={studentResult.id} className="space-y-2">
            <div>
              <h3 className="text-xl font-semibold">{`${studentResult.semester.semester_name} (${studentResult.semester.academic_year.academic_year_start} - ${studentResult.semester.academic_year.academic_year_end})`}</h3>
            </div>
            <TableWrapper
              studentEnrollments={studentResult.student_enrollments}
            />
            <div className="pl-2">
              <span className="font-medium">
                Số tín chỉ đăng kí trong học kì:
              </span>{" "}
              {studentResult.registration_credits}
            </div>
            <div className="pl-2">
              <span className="font-medium">Điểm GPA:</span>{" "}
              {studentResult.gpa ? studentResult.gpa.toFixed(2) : "Chưa cập nhật"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
