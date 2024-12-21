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
import { SemestersService } from 'src/semesters/semesters.service';
import { CourseSectionStatusEnum } from 'common/enums/course-section-status.enum';

@Injectable()
export class StudentEnrollmentService {
  constructor(
    @InjectRepository(StudentEnrollment)
    private readonly studentEnrollmentRepository: Repository<StudentEnrollment>,
    @InjectRepository(StudentSemester)
    private readonly studentSemesterRepository: Repository<StudentSemester>,
    private readonly semesterService: SemestersService,
    private readonly courseService: CoursesService,
    private readonly studentSemesterSevice: StudentSemesterService,
    private readonly courseSectionService: CourseSectionService,
  ) {}

  async enroll(createStudentEnrollmentDto: CreateStudentEnrollmentDto) {
    const courseSection = await this.courseSectionService.findOne(
      createStudentEnrollmentDto.course_section_id,
    );

    const isStudentEnrollmetExisted =
      await this.studentEnrollmentRepository.findOne({
        where: {
          student_id: createStudentEnrollmentDto.student_id,
          semester_id: courseSection.semester.semester_id,
          course_section_id: createStudentEnrollmentDto.course_section_id,
        },
      });

    if (
      courseSection.semester.semester_status === SemesterStatusEnum.COMPLETED
    ) {
      throw new HttpException(
        'Không thể đăng kí học phần này cho sinh viên vì học kỳ đã hoàn thành',
        HttpStatus.CONFLICT,
      );
    }

    if (
      courseSection.semester.semester_status === SemesterStatusEnum.NOT_STARTED
    ) {
      throw new HttpException(
        'Không thể đăng kí học phần này cho sinh viên vì học kỳ chưa được mở',
        HttpStatus.CONFLICT,
      );
    }

    // cần thiết thì check thêm học phần đang ở trạng thái nào
    if (
      courseSection.course_section_status ===
        CourseSectionStatusEnum.IN_PROGRESS ||
      courseSection.course_section_status === CourseSectionStatusEnum.COMPLETED
    ) {
      throw new HttpException(
        'Không thể đăng kí học phần này cho sinh viên',
        HttpStatus.CONFLICT,
      );
    }

    if (isStudentEnrollmetExisted) {
      throw new HttpException(
        'Sinh viên đã ghi danh học phần này',
        HttpStatus.CONFLICT,
      );
    }

    const studentSemester =
      await this.studentSemesterSevice.getStudentSemesterByStudentIdAndSemesterId(
        createStudentEnrollmentDto.student_id,
        courseSection.semester.semester_id,
      );

    // lưu đăng ký học phần và tạo điểm cho học phần
    const studentEnrollmented = await this.studentEnrollmentRepository.save({
      ...createStudentEnrollmentDto,
      semester_id: courseSection.semester.semester_id,
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

    const course = await this.courseService.findOne(
      courseSection.course.course_id,
    );

    // cập nhật số lượng tín chỉ sinh viên đăng kí trong học kì (student_semester)
    studentSemester.registration_credits += course.course_credits;
    await this.studentSemesterRepository.save(studentSemester);

    return studentEnrollmented;
  }

  async findAll(auth?: any | null, studentId?: string | number) {
    const id = studentId !== null ? studentId : auth.id;

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
        .innerJoinAndSelect('course_section.course', 'course')
        .where(
          '(semester.semester_status = :statusInProgress OR semester.semester_status = :statusCompleted)',
          {
            statusInProgress: SemesterStatusEnum.IN_PROGRESS,
            statusCompleted: SemesterStatusEnum.COMPLETED,
          },
        )
        .andWhere('student_semester.student.student_id = :id', { id })
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
        .andWhere('student_semester.student.student_id = :id', { id: auth.id })
        .getOne();

    if (!studentEnrollmentFindBySemesterId) {
      throw new HttpException('Không tìm thấy dữ liệu', HttpStatus.NOT_FOUND);
    }

    return studentEnrollmentFindBySemesterId;
  }
}
