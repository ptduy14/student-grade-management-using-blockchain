import { Chip, user } from "@nextui-org/react";
import React, { SetStateAction } from "react";
import { Button } from "@nextui-org/react";
import {
  CourseSectionStudent,
  CourseSectionStudentDetail,
} from "@/interfaces/CourseSectionStudent";
import { AddScoreModal } from "../add-score-modal";
import { UpdateScoreModal } from "../update-score-modal";
import StudentDetailModal from "../student-detail-modal";
import TransactionHistory from "@/components/students/results/transaction-history";

interface Props {
  courseSectionStudent: CourseSectionStudentDetail;
  columnKey: string | React.Key;
  setCourseSections: React.Dispatch<
    SetStateAction<CourseSectionStudent | null>
  >;
  isScoreEditable: boolean;
}

export const RenderCell = ({
  courseSectionStudent,
  columnKey,
  setCourseSections,
  isScoreEditable,
}: Props) => {
  // @ts-ignore
  const cellValue = courseSectionStudent[columnKey];
  const renderScoreCell = (
    courseSectionStudent: CourseSectionStudentDetail,
    scoreType: keyof CourseSectionStudentDetail
  ) => {
    if (
      courseSectionStudent[scoreType] === null ||
      courseSectionStudent[scoreType] === "-"
    ) {
      return (
        <AddScoreModal
          courseSectionStudent={courseSectionStudent}
          scoreType={scoreType}
          setCourseSections={setCourseSections}
        />
      );
    }

    return (
      <UpdateScoreModal
        courseSectionStudent={courseSectionStudent}
        scoreType={scoreType}
        setCourseSections={setCourseSections}
      />
    );
  };

  switch (columnKey) {
    case "student_student_code":
      return courseSectionStudent.student_student_code ?? "-";

    case "student_student_name":
      return courseSectionStudent.student_student_name ?? "-";

    case "score_midterm_score":
      return isScoreEditable
        ? renderScoreCell(courseSectionStudent, "score_midterm_score")
        : courseSectionStudent.score_midterm_score === null
        ? "-"
        : courseSectionStudent.score_midterm_score;

    case "score_final_score":
      return isScoreEditable
        ? renderScoreCell(courseSectionStudent, "score_final_score")
        : courseSectionStudent.score_final_score === null
        ? "-"
        : courseSectionStudent.score_final_score;

    case "score_total_score":
      return courseSectionStudent.score_total_score ?? "-";

    case "student_enrollment_pass_status":
      return courseSectionStudent.student_enrollment_pass_status === "Pass" ? (
        <Chip className="capitalize" color="success" size="sm" variant="flat">
          Đạt
        </Chip>
      ) : courseSectionStudent.student_enrollment_pass_status === "Fail" ? (
        <Chip className="capitalize" color="danger" size="sm" variant="flat">
          Không Đạt
        </Chip>
      ) : (
        "-"
      );

    case "actions":
      return (
        <div className="flex justify-center items-center gap-x-2">
          <StudentDetailModal
          studentId={courseSectionStudent.student_student_id}
        />
        <TransactionHistory scoreId={courseSectionStudent.score_score_id}/>
        </div>
      );
    default:
      return cellValue;
  }
};
