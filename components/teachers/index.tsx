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
import { TableWrapper } from "./table/table";
import { ITeacher } from "@/interfaces/Teacher";
import { TeacherService } from "@/services/teacher-service";
import { useSelector } from "react-redux";
import { useDebounce } from "@/hooks/useDebounce";

export const Teachers = () => {
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchType, setSearchType] = useState<string>("name");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const user = useSelector((state: any) => state.account.user);

  const getAllTeacher = async () => {
    const res = await TeacherService.getAllTeachers();
    const teacherFiltered = res.data.filter((item: ITeacher) => {
      return item.teacher_id !== user.sub; // auth id
    });
    setTeachers(teacherFiltered);
    setIsFetching(false);
  };

  const handleSearchTeacher = async (value: string, type: string) => {
    if (type === "name") {
      const res = await TeacherService.searchByName(value);
      setTeachers(res.data);
    } else {
      const res = await TeacherService.searchByWalletAdrress(value);
      setTeachers(res.data);
    }
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      handleSearchTeacher(debouncedSearchValue, searchType);
    } else {
      getAllTeacher();
    }
  }, [debouncedSearchValue]);

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
          <span>Quản lí giảng viên</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Quản Lí Giảng Viên</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            endContent={
              <div className="flex items-center">
                <label className="sr-only" htmlFor="type">
                  Type
                </label>
                <select
                  className="outline-none border-0 bg-transparent text-default-400 text-small"
                  id="type"
                  name="type"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="name">Họ tên</option>
                  <option value="address">Address</option>
                </select>
              </div>
            }
            placeholder="Tìm kiếm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
        <TableWrapper teachers={teachers} />
      </div>
    </div>
  );
};
