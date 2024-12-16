import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentSemester } from './entities/student-semester.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class StudentSemesterService {
  constructor(
    @InjectRepository(StudentSemester)
    private readonly studentSemesterRepository: Repository<StudentSemester>,
    private readonly studentService: StudentsService,
  ) {}

  // Lấy tất cả các bản ghi StudentSemester theo studentId
  async getAllStudentSemestersByStudentId(
    studentId: number,
  ): Promise<StudentSemester[]> {
    await this.studentService.findOne(studentId);

    return await this.studentSemesterRepository.find({
      where: { student: { student_id: studentId } },
      relations: ['semester'],
    });
  }

  // Lấy một học kỳ cụ thể của sinh viên dựa trên studentId và semesterId
  async getStudentSemesterByStudentIdAndSemesterId(
    studentId: number,
    semesterId: number,
  ): Promise<StudentSemester> {
    const studentSemester = await this.studentSemesterRepository.findOne({
      where: {
        student: { student_id: studentId },
        semester: { semester_id: semesterId },
      },
      relations: ['semester'],
    });

    if (!studentSemester) {
      throw new HttpException(
        `Không tìm thấy dữ liệu học kì của sinh viên này`,
        HttpStatus.NOT_FOUND,
      );
    }

    return studentSemester;
  }

  async calculateStudentsGPA(semesterId: number) {
    const students_semester = await this.studentSemesterRepository
      .createQueryBuilder('student_semester')
      .innerJoin('student_semester.semester', 'semester')
      .innerJoinAndSelect(
        'student_semester.student_enrollments',
        'student_enrollments',
      )
      .innerJoinAndSelect('student_enrollments.score', 'score')
      .innerJoinAndSelect('student_enrollments.courseSection', 'course_section')
      .innerJoinAndSelect('course_section.course', 'course')
      .where('semester.semester_id = :semesterId', { semesterId })
      .getMany();

    students_semester.forEach(async(student_semester) => {
      const score = student_semester.student_enrollments.reduce((total, item) => {
        return total + (item.score.total_score * item.courseSection.course.course_credits)
      }, 0)

      student_semester.gpa = score / student_semester.registration_credits

      await this.studentSemesterRepository.save(student_semester)
    })

    return students_semester;
  }
}
