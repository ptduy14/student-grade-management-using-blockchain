import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Semester } from 'src/semesters/entities/semester.entity';
import { StudentEnrollment } from 'src/student-enrollment/entities/student-enrollment.entity';

@Entity()
export class StudentSemester {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.studentSemesters)
  student: Student;

  @ManyToOne(() => Semester, (semester) => semester.studentSemesters)
  semester: Semester;

  @Column()
  registration_credits: number;

  @Column()
  gpa: number;

  @OneToMany(() => StudentEnrollment, (studentEnrollment) => studentEnrollment.studentSemester, {cascade: true})
  student_enrollments: StudentEnrollment[]
}
