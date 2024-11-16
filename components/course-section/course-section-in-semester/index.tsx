"use client";
import { ICourseSection } from "@/interfaces/CourseSection";
import { courseSectionService } from "@/services/course-section-service";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { ISemester } from "@/interfaces/Semester";
import { semesterService } from "@/services/semester-service";
import { TableWrapper } from "./table/table";
import { useDebounce } from "@/hooks/useDebounce";
import CompleteSemesterModal from "./action-modal/complete-semester-modal";
import { SemesterStatusEnum } from "@/common/enum/semester-status-enum";
import OpenSemesterModal from "./action-modal/open-semester-modal";
import CreateCourseSectionModal from "./action-modal/create-course-section-modal";

interface IDetailSemester extends ISemester {
  academic_year: {
    academic_year_id: number;
    academic_year_start: number;
    academic_year_end: number;
  };
}

export const CourseSectionsInSemester = ({
  semesterId,
}: {
  semesterId: string;
}) => {
  const [courseSections, setCourseSection] = useState<ICourseSection[]>([]);
  const [semester, setSemester] = useState<IDetailSemester | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500); // Debounce sau 500ms
  // using for dispatch reupdate UI after handle complete semester is done
  const [isSemesterCompleted, setIsSemesterCompleted] =
    useState<boolean>(false);
  const [isCompletedOpenSemester, setIsCompletedOpenSemester] =
    useState<boolean>(false);

  const getAllCourseSectionInSemester = async () => {
    const res = await courseSectionService.getAllCourseSectionInSemester(
      semesterId
    );
    setCourseSection(res.data);
    setIsFetching(false);
  };

  const getSemester = async () => {
    const res = await semesterService.getSemesterById(semesterId);
    setSemester(res.data);
    setIsSemesterCompleted(
      res.data.semester_status === SemesterStatusEnum.COMPLETED
    );
  };

  const searchCourseSectionInSemester = async (
    semesterId: string,
    courseSectionName: string
  ) => {
    const res = await courseSectionService.searchCourseSectionInSemester(
      semesterId,
      courseSectionName
    );
    setCourseSection(res.data);
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      searchCourseSectionInSemester(semesterId, debouncedSearchValue);
    } else {
      getAllCourseSectionInSemester();
    }
    getSemester();
  }, [debouncedSearchValue, isSemesterCompleted, isCompletedOpenSemester]);

  const handleClearInputSearch = () => {
    setSearchValue("");
  };

  const renderActionModal = () => {
    if (semester?.semester_status === SemesterStatusEnum.IN_PROGRESS) {
      return (
        <CompleteSemesterModal
          semesterId={semesterId}
          isSemesterCompleted={isSemesterCompleted}
          setIsSemesterCompleted={setIsSemesterCompleted}
        />
      );
    }

    if (semester?.semester_status === SemesterStatusEnum.NOT_STARTED) {
      return (
        <>
          <OpenSemesterModal
            semesterId={semesterId}
            setIsCompletedOpenSemester={setIsCompletedOpenSemester}
          />
          <CreateCourseSectionModal
            semesterId={semesterId}
            setCourseSection={setCourseSection}
          />
        </>
      );
    }

    return <></>;
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
          <span>Năm học</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>Danh sách học kỳ</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">{`Lớp học phần giảng dạy ${
        semester?.semester_name +
        ` (${
          semester?.academic_year.academic_year_start.toString() +
          " - " +
          semester?.academic_year.academic_year_end.toString()
        })`
      }`}</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Tìm kiếm lớp học phần"
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
          {renderActionModal()}
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper courseSections={courseSections} />
      </div>
    </div>
  );
};
