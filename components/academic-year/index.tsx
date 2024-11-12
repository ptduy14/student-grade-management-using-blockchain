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
import { IAcademicYear } from "@/interfaces/AcademicYear";
import { acdemicYearService } from "@/services/academic-year-service";

export const AcademicYear = ({
  academicYearId,
}: {
  academicYearId: string;
}) => {
  const [academicYearDetail, setAcademicYearDetail] = useState<IAcademicYear>();

  const getDetailAcademicYear = async () => {
    const res = await acdemicYearService.getDetailAcademicYear(academicYearId);
    setAcademicYearDetail(res.data);
  };

  useEffect(() => {
    getDetailAcademicYear();
  }, []);

  if (!academicYearDetail) return <div className="w-full h-full flex justify-center items-center" >Waiting...</div>;
  
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
          <span>Năm học</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>Danh sách học kỳ</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">{`Năm học ${academicYearDetail.academic_year_start.toString() + " - " + academicYearDetail.academic_year_end.toString()}`}</h3>
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
        <TableWrapper semesters={academicYearDetail?.semesters} />
      </div>
    </div>
  );
};
