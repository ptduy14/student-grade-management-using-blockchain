import { Chip } from "@nextui-org/react";
import React from "react";
import { Button } from "@nextui-org/react";
import { CourseSectionStudentDetail } from "@/interfaces/CourseSectionStudent";

interface Props {
  courseSectionStudent: CourseSectionStudentDetail;
  columnKey: string | React.Key;
}

export const RenderCell = ({ courseSectionStudent, columnKey }: Props) => {
  // @ts-ignore
  const cellValue = courseSectionStudent[columnKey];
  switch (columnKey) {
    case "student_student_code":
      return courseSectionStudent.student_student_code ?? "-";

    case "student_student_name":
      return courseSectionStudent.student_student_name ?? "-";

    case "score_midterm_score":
      return courseSectionStudent.score_midterm_score ?? "-";

      case "score_final_score":
        return courseSectionStudent.score_final_score ?? "-";

      case "score_total_score":
      return courseSectionStudent.score_total_score ?? "-";

      case "student_enrollment_pass_status":
        return courseSectionStudent.student_enrollment_pass_status === "Pass" ? <Chip className="capitalize" color="success" size="sm" variant="flat">
        Đạt
      </Chip> : courseSectionStudent.student_enrollment_pass_status === "Fail" ? <Chip className="capitalize" color="danger" size="sm" variant="flat">
        Không Đạt
      </Chip> : "-"

    case "actions":
      return (
        <Button color="primary" href={``}>
          Chi tiết sinh viên
        </Button>
      );
    default:
      return cellValue;
  }
};
