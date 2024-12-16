import { CourseSection } from 'src/course-section/entities/course-section.entity';
import { Score } from 'src/scores/entities/score.entity';
import { StudentSemester } from 'src/student-semester/entities/student-semester.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { PassStatusEnum } from 'common/enums/pass-status.enum';

@Entity()
export class StudentEnrollment {
  @PrimaryColumn()
  student_id: number;

  @PrimaryColumn()
  semester_id: number;

  @PrimaryColumn()
  course_section_id: number;

  @Column({
    type: 'enum',
    enum: PassStatusEnum,
    default: PassStatusEnum.UNDETERMINED,
  })
  pass_status: PassStatusEnum; // Trạng thái "Đạt", "Không đạt", hoặc "Chưa xác định"

  @ManyToOne(
    () => StudentSemester,
    (studentSemester) => studentSemester.student_enrollments,
  )
  studentSemester: StudentSemester;

  @ManyToOne(
    () => CourseSection,
    (courseSection) => courseSection.student_enrollments,
  )
  courseSection: CourseSection;

  @OneToOne(() => Score, { cascade: true })
  @JoinColumn()
  score: Score;
}
