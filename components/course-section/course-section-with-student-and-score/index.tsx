"use client";
import { useEffect, useState } from "react";
import { CourseSectionStudent } from "@/interfaces/CourseSectionStudent";
import Link from "next/link";
import { DotsIcon } from "@/components/icons/accounts/dots-icon";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { InfoIcon } from "@/components/icons/accounts/info-icon";
import { TrashIcon } from "@/components/icons/accounts/trash-icon";
import { HouseIcon } from "@/components/icons/breadcrumb/house-icon";
import { SettingsIcon } from "@/components/icons/sidebar/settings-icon";
import { Button, Input } from "@nextui-org/react";
import { courseSectionService } from "@/services/course-section-service";
import { TableWrapper } from "./table/table";
import { useDebounce } from "@/hooks/useDebounce";
import { FlagIcon } from "@/components/icons/flag-icon";
import { CompleteCourseSectionModal } from "./complete-course-section-modal";
import { CourseSectionStatusEnum } from "./enum/course-section-status-enum";
import { useSelector } from "react-redux";
import ReopenCourseSection from "./admin-role/reopen-course-section-modal";
import { SemesterStatusEnum } from "@/common/enum/semester-status-enum";

export const CourseSectionWithStudentAndScore = ({
  courseSectionId,
}: {
  courseSectionId: string;
}) => {
  const user = useSelector((state: any) => state.account.user);
  const [courseSections, setCourseSections] =
    useState<CourseSectionStudent | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState("");
  const [isScoreEditable, setIsScoreEditable] = useState<boolean>(false);
  const debouncedSearchValue = useDebounce(searchValue, 500); // Debounce sau 500ms
  // this state use to trigger rerender of parent component when admin completed reopen course section
  const [isReopenCompleted, setIsReopenCompleted] = useState<boolean>(false);

  const getCourseSectionWithStudentAndScore = async () => {
    const res = await courseSectionService.getCourseSectionWithStudentAndScore(
      courseSectionId
    );
    setCourseSections(res.data);
    if (user?.role === "teacher") {
      setIsScoreEditable(
        res.data.courseSection.course_section_status ===
          CourseSectionStatusEnum.IN_PROGRESS
          ? true
          : false
      );
    }
    setIsFetching(false);
  };

  const findStudentByName = async (
    courseSectionId: string,
    studentName: string
  ) => {
    const res = await courseSectionService.findStudentByName(
      courseSectionId,
      studentName
    );
    setCourseSections(res.data);
  };

  useEffect(() => {
    if (debouncedSearchValue) {
      findStudentByName(courseSectionId, debouncedSearchValue);
    } else {
      getCourseSectionWithStudentAndScore();
    }
  }, [debouncedSearchValue, isScoreEditable, isReopenCompleted]);

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
          <span>Năm học</span>
          <span> / </span>{" "}
        </li>
        <li className="flex gap-2">
          <span>Danh sách học phần</span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">{`Lớp học phần - ${
        courseSections?.courseSection.course_section_name
      } - ${
        courseSections?.semester.semester_name +
        ` (${
          courseSections?.semester.academic_year.academic_year_start.toString() +
          " - " +
          courseSections?.semester.academic_year.academic_year_end.toString()
        })`
      }`}</h3>
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
          {user?.role === "teacher" ? (
            <CompleteCourseSectionModal
              courseSectionId={courseSectionId}
              isScoreEditable={isScoreEditable}
              setIsScoreEditable={setIsScoreEditable}
            />
          ) : courseSections?.courseSection.course_section_status ===
              CourseSectionStatusEnum.COMPLETED &&
            courseSections?.semester.semester_status !==
              SemesterStatusEnum.COMPLETED ? (
            <ReopenCourseSection
              courseSectionId={courseSectionId}
              setIsReopenCompleted={setIsReopenCompleted}
            />
          ) : (
            <></>
          )}

          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper
          students={courseSections!.students}
          setCourseSections={setCourseSections}
          isScoreEditable={isScoreEditable}
        />
      </div>
    </div>
  );
};
