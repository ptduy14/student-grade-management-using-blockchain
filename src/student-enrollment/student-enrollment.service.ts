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
import { CoursesService } from 'src/courses/courses.service';
import { PassStatusEnum } from 'common/enums/pass-status.enum';

@Injectable()
export class StudentEnrollmentService {
  constructor(
    @InjectRepository(StudentEnrollment)
    private readonly studentEnrollmentRepository: Repository<StudentEnrollment>,
    @InjectRepository(StudentSemester)
    private readonly studentSemesterRepository: Repository<StudentSemester>,
    private readonly courseService: CoursesService,
    private readonly studentSemesterSevice: StudentSemesterService,
    private readonly courseSectionService: CourseSectionService,
  ) {}

  async enroll(createStudentEnrollmentDto: CreateStudentEnrollmentDto) {
    const isStudentEnrollmetExisted =
      await this.studentEnrollmentRepository.findOne({
        where: {
          student_id: createStudentEnrollmentDto.student_id,
          semester_id: createStudentEnrollmentDto.semester_id,
          course_section_id: createStudentEnrollmentDto.course_section_id,
        },
      });

    if (isStudentEnrollmetExisted) {
      throw new HttpException(
        'Học phần này đã được đăng kí',
        HttpStatus.CONFLICT,
      );
    }

    const studentSemester =
      await this.studentSemesterSevice.getStudentSemesterByStudentIdAndSemesterId(
        createStudentEnrollmentDto.student_id,
        createStudentEnrollmentDto.semester_id,
      );

    const courseSection = await this.courseSectionService.findOne(
      createStudentEnrollmentDto.course_section_id,
    );

    // lưu đăng ký học phần và tạo điểm cho học phần
    const studentEnrollmented = await this.studentEnrollmentRepository.save({
      ...createStudentEnrollmentDto,
      pass_status: PassStatusEnum.UNDETERMINED,
      studentSemester: studentSemester,
      courseSection: courseSection,
      score: {
        midterm_score: null,
        final_score: null,
        total_score: null,
      },
    });

    // cập nhật số lượng sinh viên đăng ký trong học phần
    await this.courseSectionService.updateCurrentStudents({
      ...courseSection,
      current_students: courseSection.current_students + 1,
    });

    // cập nhật số lượng tín chỉ sinh viên đăng kí trong học kì (student_semester)
    const course = await this.courseService.findOne(
      courseSection.course.course_id,
    );
    await this.studentSemesterRepository.save({
      ...studentSemester,
      registration_credits:
        studentSemester.registration_credits + course.course_credits,
    });

    return studentEnrollmented;
  }

  async findAll(auth: any) {
    const studentEnrollmentFindBySemesters =
      await this.studentSemesterRepository
        .createQueryBuilder('student_semester')
        .innerJoinAndSelect('student_semester.semester', 'semester')
        .innerJoinAndSelect('semester.academic_year', 'academic_year')
        .innerJoinAndSelect(
          'student_semester.student_enrollments',
          'student_enrollment',
        )
        .innerJoinAndSelect(
          'student_enrollment.courseSection',
          'course_section',
        )
        .innerJoinAndSelect('student_enrollment.score', 'score')
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

  // async findOne(studentId: number, semesterId: number, courseSectionId: number) {
  //   const enrollment = await this.studentEnrollmentRepository.findOne({
  //     where: {
  //       student_id: studentId,
  //       semester_id: semesterId,
  //       course_section_id: courseSectionId,
  //     },
  //     relations: {score: true},
  //   });

  //   if (!enrollment) {
  //     throw new HttpException('Không tìm thấy học phần', HttpStatus.NOT_FOUND);
  //   }
    
  //   return enrollment;
  // }

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
}
