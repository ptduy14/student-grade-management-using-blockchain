import { CourseSection } from "src/course-section/entities/course-section.entity";
import { StudentSemester } from "src/student-semester/entities/student-semester.entity";
import { Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class StudentEnrollment {
    @PrimaryColumn()
    student_id: number

    @PrimaryColumn()
    semester_id: number

    @PrimaryColumn()
    course_section_id: number

    @ManyToOne(() => StudentSemester, (studentSemester) => studentSemester.student_enrollments)
    studentSemester: StudentSemester

    @ManyToOne(() => CourseSection, (courseSection) => courseSection.student_enrollments)
    courseSection: CourseSection
}
