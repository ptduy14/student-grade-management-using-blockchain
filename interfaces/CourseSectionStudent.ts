import { CourseSectionStatusEnum } from "@/components/course-section/course-section-with-student-and-score/enum/course-section-status-enum";

export interface CourseSectionStudentDetail {
  student_enrollment_course_section_id: number;
  student_enrollment_pass_status: string;
  student_student_code: number;
  student_student_id: number;
  student_student_name: string;
  student_student_email: string;
  semester_semester_id: number;
  score_score_id: number;
  score_midterm_score: number | null;
  score_final_score: number | null;
  score_total_score: number | null;
}

export interface CourseSectionStudent {
  courseSection: {
    course_section_id: number;
    course_section_name: string;
    course_section_status: CourseSectionStatusEnum;
    current_students: number;
  };
  semester: {
    semester_id: number;
    semester_name: string;
    semester_status: string;
    academic_year: {
      academic_year_id: number;
      academic_year_start: number;
      academic_year_end: number;
    };
  };
  students: CourseSectionStudentDetail[];
}
