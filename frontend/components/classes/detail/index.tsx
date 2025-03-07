"use client";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { UsersIcon } from "@/components/icons/breadcrumb/users-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { TableWrapper } from "@/components/table/table";
import { IStudent } from "@/interfaces/Student";
import { classService } from "@/services/class-service";
import { IClass } from "@/interfaces/Class";
import { IClassDetail } from "@/interfaces/ClassDetail";

export const detailClass = ({classId}: {classId: string}) => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [detail, setDetail] = useState<IClassDetail>();

    const getAllStudentsInClass = async() => {
        const res = await classService.getAllStudents(classId);
        setDetail(res.data.students);
        setIsFetching(false);
    }

    useEffect(() => {
        getAllStudentsInClass();
    }, [])

    if (isFetching) return <div className="w-full h-full flex justify-center items-center" >Waiting...</div>;

    return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={"/"}>
            <span>Home</span>
          </Link>
          <span> / </span>{" "}
        </li>

        <li className="flex gap-2">
          <UsersIcon />
          <span>Users</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>danh sách</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Danh sách sinh viên lớp {detail?.class_name} - {detail?.cohort.cohort_name}</h3>
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
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper />
      </div>
    </div>
  );
};