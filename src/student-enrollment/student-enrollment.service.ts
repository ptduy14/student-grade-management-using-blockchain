import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentEnrollmentDto } from './dto/create-student-enrollment.dto';
import { UpdateStudentEnrollmentDto } from './dto/update-student-enrollment.dto';
import { StudentSemesterService } from 'src/student-semester/student-semester.service';
import { CourseSectionService } from 'src/course-section/course-section.service';
import { StudentEnrollment } from './entities/student-enrollment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SemesterStatusEnum } from 'common/enums/semester-status.enum';
import { StudentSemester } from 'src/student-semester/entities/student-semester.entity';

@Injectable()
export class StudentEnrollmentService {
  constructor(
    @InjectRepository(StudentEnrollment)
    private readonly studentEnrollmentRepository: Repository<StudentEnrollment>,
    @InjectRepository(StudentSemester)
    private readonly studentSemesterRepository: Repository<StudentSemester>,
    private readonly studentSemesterSevice: StudentSemesterService,
    private readonly courseSectionService: CourseSectionService,
  ) {}

  async enroll(createStudentEnrollmentDto: CreateStudentEnrollmentDto) {
    const studentSemester =
      await this.studentSemesterSevice.getStudentSemesterByStudentIdAndSemesterId(
        createStudentEnrollmentDto.student_id,
        createStudentEnrollmentDto.semester_id,
      );
    const courseSection = await this.courseSectionService.findOne(
      createStudentEnrollmentDto.course_section_id,
    );

    const studentEnrollmented = await this.studentEnrollmentRepository.save({
      ...createStudentEnrollmentDto,
      studentSemester: studentSemester,
      courseSection: courseSection,
    });

    return studentEnrollmented;
  }

  async findAll(auth: any) {
    const studentEnrollmentFindBySemesters =
      await this.studentSemesterRepository
        .createQueryBuilder('student_semester')
        .innerJoinAndSelect('student_semester.semester', 'semester')
        .innerJoinAndSelect(
          'student_semester.student_enrollments',
          'student_enrollment',
        )
        .innerJoinAndSelect(
          'student_enrollment.courseSection',
          'course_section',
        )
        .where(
          '(semester.semester_status = :statusInProgress OR semester.semester_status = :statusCompleted)',
          {
            statusInProgress: SemesterStatusEnum.IN_PROGRESS,
            statusCompleted: SemesterStatusEnum.COMPLETED,
          },
        )
        .andWhere('student_semester.student.student_id = :id', { id: auth.id })
        .getMany();

    return studentEnrollmentFindBySemesters;
  }

  async findBySemesterId(auth: any, semesterId: number) {
    const studentEnrollmentFindBySemesterId =
      await this.studentSemesterRepository
        .createQueryBuilder('studentSemester')
        .innerJoinAndSelect('studentSemester.semester', 'semester')
        .innerJoinAndSelect(
          'studentSemester.student_enrollments',
          'student_enrollment',
        )
        .innerJoinAndSelect(
          'student_enrollment.courseSection',
          'course_section',
        )
        .where(
          '(semester.semester_status = :statusInProgress OR semester.semester_status = :statusCompleted)',
          {
            statusInProgress: SemesterStatusEnum.IN_PROGRESS,
            statusCompleted: SemesterStatusEnum.COMPLETED,
          },
        )
        .andWhere('semester.semester_id = :semesterId', { semesterId })
        .getOne();

    if (!studentEnrollmentFindBySemesterId) {
      throw new HttpException('Không tìm thấy dữ liệu', HttpStatus.NOT_FOUND);
    }

    return studentEnrollmentFindBySemesterId;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentEnrollment`;
  }

  update(id: number, updateStudentEnrollmentDto: UpdateStudentEnrollmentDto) {
    return `This action updates a #${id} studentEnrollment`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentEnrollment`;
  }
}
