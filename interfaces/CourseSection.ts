import { ICourse } from "./Course";
import { ISemester } from "./Semester";

export interface ICourseSection {
    course_section_id: number,
    course_section_name: string,
    current_students: number,
    semester: ISemester,
    course: ICourse
}