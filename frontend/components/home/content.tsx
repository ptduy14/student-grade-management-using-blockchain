"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TableWrapper } from "../teachers/table/table";
import { TableWrapper as TableCourseSectionWrapper } from "../course-section/course-section-teaching-in-semester/table/table";
import { CardTransactions } from "./card-transactions";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";
import { TeacherService } from "@/services/teacher-service";
import { ITeacher } from "@/interfaces/Teacher";
import { useSelector } from "react-redux";
import { CardBalance1 } from "./card-balance1";
import { CardBalance2 } from "./card-balance2";
import { CardBalance3 } from "./card-balance3";
import { ISemester } from "@/interfaces/Semester";
import { semesterService } from "@/services/semester-service";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { courseSectionService } from "@/services/course-section-service";
import { ICourseSection } from "@/interfaces/CourseSection";

const Chart = dynamic(
  () => import("../charts/steam").then((mod) => mod.Steam),
  {
    ssr: false,
  }
);

export const Content = () => {
  const user = useSelector((state: any) => state.account.user);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [courseSections, setCourseSection] = useState<ICourseSection[]>([]);
  const [currentSemester, setCurrentSemester] = useState<ISemester | null>();

  const getAllTeacher = async () => {
    const res = await TeacherService.getAllTeachers();
    const teacherFiltered = res.data.filter((item: ITeacher) => {
      return item.teacher_id !== user.sub; // auth id
    });
    setTeachers(teacherFiltered);
  };

  const getCurrentOpenSemester = async () => {
    try {
      const res = await semesterService.getCurrentOpenSemester();
      setCurrentSemester(res.data);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.info(error.response?.data.message);
      }
    } finally {
    }
  };

  const getCourseSectionTeaching = async (semesterId: string) => {
    const res = await courseSectionService.getCourseSectionTeachingInSemester(
      semesterId
    );
    setCourseSection(res.data);
  };

  useEffect(() => {
    if (user?.role === "admin") {
      getAllTeacher();
    }

    if (user?.role === "teacher") {
      getCurrentOpenSemester();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === "teacher" && currentSemester?.semester_id) {
      getCourseSectionTeaching(currentSemester.semester_id.toString());
    }
  }, [user, currentSemester]);

  return (
    <div className="h-full lg:px-6">
      {user?.role === "teacher" && (
        <>
          <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
            <div className="mt-4 gap-2 flex flex-col w-full">
              <h3 className="text-xl font-semibold">Lớp học phần</h3>
              <CardBalance1 courseSections={courseSections} />
            </div>
            <div className="mt-4 gap-2 flex flex-col w-full">
              <h3 className="text-xl font-semibold">
                Lớp học phần đang giảng dạy
              </h3>
              <CardBalance2 courseSections={courseSections} />
            </div>
            <div className="mt-4 gap-2 flex flex-col w-full">
              <h3 className="text-xl font-semibold">Lớp học phần hoàn thành</h3>
              <CardBalance3 courseSections={courseSections} />
            </div>
          </div>

          <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0  max-w-[90rem] mx-auto gap-3">
            <div className="flex  flex-wrap justify-between">
              <h3 className="text-center text-xl font-semibold">
                Danh sách lớp học phần giảng dạy
              </h3>
              <Link
                href="/accounts"
                as={NextLink}
                color="primary"
                className="cursor-pointer"
              >
                Xem tất cả
              </Link>
            </div>
            <TableCourseSectionWrapper courseSections={courseSections} />
          </div>
        </>
      )}

      {/* Table Latest Users */}
      {user?.role === "admin" && (
        <>
          <div className="flex justify-center gap-4 xl:gap-6 pt-3 px-4 lg:px-0  flex-wrap xl:flex-nowrap sm:pt-10 max-w-[90rem] mx-auto w-full">
            <div className="mt-4 gap-2 flex flex-col w-full">
              <h3 className="text-xl font-semibold">Giao dịch mới nhất</h3>
              <div className="">
                <CardTransactions />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center w-full py-5 px-4 lg:px-0  max-w-[90rem] mx-auto gap-3">
            <div className="flex  flex-wrap justify-between">
              <h3 className="text-center text-xl font-semibold">
                Danh sách giảng viên
              </h3>
              <Link
                href="/accounts"
                as={NextLink}
                color="primary"
                className="cursor-pointer"
              >
                Xem tất cả
              </Link>
            </div>
            <TableWrapper teachers={teachers} />
          </div>
        </>
      )}
    </div>
  );
};
