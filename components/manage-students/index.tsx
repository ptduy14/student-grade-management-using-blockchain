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
import { TableWrapper } from "./table/table";
import { IStudent } from "@/interfaces/Student";
import { studentService } from "@/services/student-service";
import { useDebounce } from "@/hooks/useDebounce";

export const ManageStudents = () => {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500); // Debounce sau 500ms

  const getAllStudents = async () => {
    const res = await studentService.getAllStudents();
    setStudents(res.data);
    setIsFetching(false);
  };

  const searchStudentByName = async(value: string) => {
    const res = await studentService.searchByName(value);
    setStudents(res.data);
    setIsFetching(false);
  }

  useEffect(() => {
    if (debouncedSearchValue) {
        searchStudentByName(debouncedSearchValue);
        return;
    }
    getAllStudents();
  }, [debouncedSearchValue]);

  const handleClearInputSearch = () => {
    setSearchValue("");
  };

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
          <UsersIcon />
          <span>Sinh viên</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>Danh sách</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Danh sách sinh viên</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
        <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Tìm kiếm sinh viên"
            value={searchValue}
            onClear={() => handleClearInputSearch()}
            onChange={(e: any) => setSearchValue(e.target.value)}
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
        <TableWrapper students={students}/>
      </div>
    </div>
  );
};
