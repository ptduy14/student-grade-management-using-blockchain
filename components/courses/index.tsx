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
import { ICourse } from "@/interfaces/Course";
import { CourseService } from "@/services/course-service";
import { TableWrapper } from "./table/table";
import AddCourseModal from "./add-course-modal";

export const Courses = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [courses, setCourses] = useState<ICourse[]>([]);

  const getAllCourses = async () => {
    const res = await CourseService.getAllCourses();
    setCourses(res.data);
    setIsFetching(false);
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  if (isFetching) return <h1>Waiting...</h1>;

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
          <span>Quản lí môn học</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Quản Môn Học</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search users"
          />
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <AddCourseModal setCourses={setCourses}/>
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper courses={courses} />
      </div>
    </div>
  );
};
