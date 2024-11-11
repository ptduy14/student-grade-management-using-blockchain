import { Chip } from "@nextui-org/react";
import React, { SetStateAction } from "react";
import { Button } from "@nextui-org/react";
import {
  CourseSectionStudent,
  CourseSectionStudentDetail,
} from "@/interfaces/CourseSectionStudent";
import { AddScoreModal } from "../add-score-modal";
import { UpdateScoreModal } from "../update-score-modal";
import StudentDetailModal from "../student-detail-modal";

interface Props {
  courseSectionStudent: CourseSectionStudentDetail;
  columnKey: string | React.Key;
  setCourseSections: React.Dispatch<
    SetStateAction<CourseSectionStudent | null>
  >;
}

export const RenderCell = ({
  courseSectionStudent,
  columnKey,
  setCourseSections,
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
      return renderScoreCell(courseSectionStudent, "score_midterm_score");

    case "score_final_score":
      return renderScoreCell(courseSectionStudent, "score_final_score");

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
        <StudentDetailModal
          studentId={courseSectionStudent.student_student_id}
        />
      );
    default:
      return cellValue;
  }
};
