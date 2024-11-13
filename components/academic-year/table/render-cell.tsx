import { Chip } from "@nextui-org/react";
import React from "react";
import { Link, Button } from "@nextui-org/react";
import { convertSemesterStatus } from "@/heplers/convert-semester-status";

interface Props {
  semester: any;
  columnKey: string | React.Key;
  user: any;
}

export const RenderCell = ({ semester, columnKey, user }: Props) => {
  // @ts-ignore
  const cellValue = semester[columnKey];
  switch (columnKey) {
    case "semester_status":
      return (
        <Chip
          size="sm"
          variant="flat"
          color={
            cellValue === "Not Started"
              ? "danger"
              : cellValue === "In Progress"
              ? "warning"
              : "success"
          }
        >
          <span className="capitalize text-xs">
            {convertSemesterStatus(cellValue)}
          </span>
        </Chip>
      );

    case "actions":
      if (user?.role === "teacher") return <Button color="primary" href={`/teacher/course-section/semesters/${semester.semester_id}`} as={Link}>Lớp học phần giảng dạy</Button>;
      return <div className="flex justify-center items-center gap-x-4">
        <Button color="primary" href={`/admin/course-section/semesters/${semester.semester_id}`} as={Link}>Lớp học phần</Button>
        <Button color="primary" href={`/admin/course-section/semesters/${semester.semester_id}`} as={Link}>Cập nhật trạng thái</Button>
      </div>
    default:
      return cellValue;
  }
};
