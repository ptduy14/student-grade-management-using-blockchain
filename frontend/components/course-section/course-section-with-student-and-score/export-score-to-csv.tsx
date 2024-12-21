import { Button } from "@nextui-org/react";
import { ExportIcon } from "@/components/icons/accounts/export-icon";
import { CourseSectionStudentDetail } from "@/interfaces/CourseSectionStudent";
import { CSVLink } from "react-csv";

export const ExportScoreToCSV = ({
  studentsScore,
}: {
  studentsScore: CourseSectionStudentDetail[];
}) => {
  const handleStudentCourseSectionStatus = (status: string) => {
    switch (status) {
      case "Pass":
        return "Đạt";

      case "Fail":
        return "Không đạt";

      case "Undetermined":
        return "-";

      default:
        "-";
        break;
    }
  };

  const headers = [
    { label: "Mã số sinh viên", key: "student_student_code" },
    { label: "Tên sinh viên", key: "student_student_name" },
    { label: "Điểm giữa kỳ", key: "score_midterm_score" },
    { label: "Điểm cuối kỳ", key: "score_final_score" },
    { label: "Điểm tổng kết", key: "score_total_score" },
    { label: "Trạng thái", key: "student_enrollment_pass_status" },
  ];

  const data = studentsScore.map((studentScore: CourseSectionStudentDetail) => {
    return {
      student_student_code: studentScore.student_student_code,
      student_student_name: studentScore.student_student_name,
      score_midterm_score: studentScore.score_midterm_score ?? "-",
      score_final_score: studentScore.score_final_score ?? "-",
      score_total_score: studentScore.score_total_score ?? "-",
      student_enrollment_pass_status: handleStudentCourseSectionStatus(
        studentScore.student_enrollment_pass_status
      ),
    };
  });

  return (
    <Button color="primary" startContent={<ExportIcon />}>
      <CSVLink data={data} headers={headers} filename={"file-diem-sinh-vien.csv"}>
        Export to CSV
      </CSVLink>
    </Button>
  );
};
