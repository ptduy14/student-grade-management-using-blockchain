import { Button, Chip } from "@nextui-org/react";
import React from "react";
import { IStudentEnrollment } from "@/interfaces/StudentResult";
import TransactionHistory from "../transaction-history";

interface Props {
  studentEnrollment: IStudentEnrollment;
  columnKey: string | React.Key;
}

export const RenderCell = ({ studentEnrollment, columnKey }: Props) => {
  // @ts-ignore
  const cellValue = studentEnrollment[columnKey];
  switch (columnKey) {
    case "course_section_id":
      return studentEnrollment.course_section_id;

    case "course_section_name":
      return studentEnrollment.courseSection.course_section_name;

    case "course_credits":
      return studentEnrollment.courseSection.course.course_credits;

    case "midterm_score":
      return studentEnrollment.score.midterm_score ?? "-";

    case "final_score":
      return studentEnrollment.score.final_score ?? "-";

    case "pass_status":
      return studentEnrollment.pass_status === "Pass" ? (
        <Chip className="capitalize" color="success" size="sm" variant="flat">
          Đạt
        </Chip>
      ) : studentEnrollment.pass_status === "Fail" ? (
        <Chip className="capitalize" color="danger" size="sm" variant="flat">
          Không Đạt
        </Chip>
      ) : (
        "-"
      );

    case "transaction_history":
      return <TransactionHistory scoreId={studentEnrollment.score.score_id}/>

    default:
      return cellValue;
  }
};
