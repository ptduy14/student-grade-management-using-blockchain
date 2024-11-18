import studentResults from "@/app/(app)/student/results/page";
import { IAcademicYear } from "./AcademicYear";
import { ICourse } from "./Course";
import { ICourseSection } from "./CourseSection";

interface Semester {
  semester_id: number;
  semester_name: string;
  semester_status: string;
  academic_year: IAcademicYear;
}

interface Score {
  score_id: number;
  midterm_score: string | null;
  final_score: string | null;
  total_score: string | null;
}

export interface IStudentEnrollment {
  student_id: number;
  semester_id: number;
  course_section_id: number;
  pass_status: string;
  courseSection: ICourseSection;
  score: Score;
}

export interface IStudentResult {
  id: number;
  registration_credits: number;
  gpa: number | null;
  semester: Semester;
  student_enrollments: IStudentEnrollment[];
}
