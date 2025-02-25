import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseSectionDto } from './dto/create-course-section.dto';
import { UpdateCourseSectionDto } from './dto/update-course-section.dto';
import { SemestersService } from 'src/semesters/semesters.service';
import { CoursesService } from 'src/courses/courses.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { UserRoleEnum } from 'common/enums/user-role.enum';
import { SemesterStatusEnum } from 'common/enums/semester-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseSection } from './entities/course-section.entity';
import { Repository } from 'typeorm';
import { StudentEnrollment } from 'src/student-enrollment/entities/student-enrollment.entity';
import { CourseSectionStatusEnum } from 'common/enums/course-section-status.enum';

@Injectable()
export class CourseSectionService {
  constructor(
    @InjectRepository(CourseSection)
    private readonly courseSectionRepository: Repository<CourseSection>,
    @InjectRepository(StudentEnrollment)
    private readonly studentEnrollmentRepository: Repository<StudentEnrollment>,
    private readonly semesterService: SemestersService,
    private readonly courseService: CoursesService,
    private readonly teacherService: TeachersService,
  ) {}

  async create(createCourseSectionDto: CreateCourseSectionDto) {
    const semester = await this.semesterService.findOne(
      createCourseSectionDto.semester_id,
    );

    const course = await this.courseService.findOne(
      createCourseSectionDto.course_id,
    );

    const teacher = await this.teacherService.findOne(
      createCourseSectionDto.teacher_id,
    );

    if (semester.semester_status === SemesterStatusEnum.IN_PROGRESS || semester.semester_status === SemesterStatusEnum.COMPLETED) {
      throw new HttpException('Không thể tạo học phần vào lúc này', HttpStatus.CONFLICT);
    }

    if (teacher.teacher_role === UserRoleEnum.ADMIN) {
      throw new HttpException(
        'Giáo viên được chỉ định không hợp lệ',
        HttpStatus.BAD_REQUEST,
      );
    }

    const courseSectionCreated = await this.courseSectionRepository.save({
      semester: semester,
      course: course,
      teacher: teacher,
      course_section_name: course.course_name,
      course_section_status: CourseSectionStatusEnum.NOT_STARTED,
      current_students: 0,
    });

    return courseSectionCreated;
  }

  async findAll() {
    const courseSections = await this.courseSectionRepository
      .createQueryBuilder('course_section')
      .leftJoinAndSelect('course_section.semester', 'semester')
      .leftJoinAndSelect('course_section.course', 'course')
      .leftJoinAndSelect('course_section.teacher', 'teacher')
      .select([
        'course_section',
        'semester',
        'course',
        'teacher.teacher_id',
        'teacher.teacher_name',
        'teacher.teacher_email',
      ])
      .getMany();

    return courseSections;
  }

  async findAllBySemester(id: number) {
    return await this.courseSectionRepository
      .createQueryBuilder('course_section')
      .leftJoinAndSelect('course_section.semester', 'semester')
      .leftJoinAndSelect('course_section.course', 'course')
      .leftJoinAndSelect('course_section.teacher', 'teacher')
      .where('semester.semester_id = :id', { id })
      .select([
        'course_section',
        'semester',
        'course',
        'teacher.teacher_id',
        'teacher.teacher_name',
        'teacher.teacher_email',
      ])
      .getMany();
  }

  async findAllCourseSectionsByTeacher(auth: any) {
    return await this.courseSectionRepository
      .createQueryBuilder('course_section')
      .leftJoinAndSelect('course_section.semester', 'semester')
      .leftJoinAndSelect('course_section.course', 'course')
      .leftJoinAndSelect('course_section.teacher', 'teacher')
      .where('teacher.teacher_id = :id', { id: auth.id })
      .select(['course_section', 'semester', 'course'])
      .getMany();
  }

  async findAllCourseSectionsByTeacherAndSemester(auth: any, id: number) {
    return await this.courseSectionRepository
      .createQueryBuilder('course_section')
      .leftJoinAndSelect('course_section.semester', 'semester')
      .leftJoinAndSelect('course_section.course', 'course')
      .leftJoinAndSelect('course_section.teacher', 'teacher')
      .where('teacher.teacher_id = :teacherId', { teacherId: auth.id })
      .andWhere('semester.semester_id = :semesterId', { semesterId: id })
      .select(['course_section', 'semester', 'course'])
      .getMany();
  }

  async getTeacherFromCourseSection(
    teacherId: number,
    courseSectionId: number,
  ) {
    const teacher = this.courseSectionRepository.findOne({
      where: {
        teacher: { teacher_id: teacherId },
        course_section_id: courseSectionId,
      },
    });

    if (!teacher) {
      throw new HttpException(
        'Giảng viên không dạy học phần này',
        HttpStatus.NOT_FOUND,
      );
    }

    return teacher;
  }

  async getStudentFormCourseSection(studentId: number) {
    const student = await this.courseSectionRepository.find({
      where: { student_enrollments: { student_id: studentId } },
    });

    if (student) {
      throw new HttpException(
        'Sinh viên không học lớp này',
        HttpStatus.NOT_FOUND,
      );
    }

    return student;
  }

  async findOne(id: number) {
    const courseSection = await this.courseSectionRepository
      .createQueryBuilder('course_section')
      .leftJoinAndSelect('course_section.semester', 'semester')
      .leftJoinAndSelect('course_section.course', 'course')
      .leftJoinAndSelect('course_section.teacher', 'teacher')
      .where('course_section.course_section_id = :id', { id })
      .select([
        'course_section',
        'semester',
        'course',
        'teacher.teacher_id',
        'teacher.teacher_name',
        'teacher.teacher_email',
      ])
      .getOne();

    if (!courseSection) {
      throw new HttpException(
        'Không tìm thấy lớp học phần',
        HttpStatus.NOT_FOUND,
      );
    }

    return courseSection;
  }

  async findAllStudentsAndScoreInCourseSection(courseSectionId: number) {
    const students = await this.studentEnrollmentRepository
      .createQueryBuilder('student_enrollment')
      .innerJoin('student_enrollment.studentSemester', 'student_semester')
      .innerJoin('student_semester.student', 'student')
      .innerJoin('student_semester.semester', 'semester')
      .innerJoinAndSelect('student_enrollment.score', 'score')
      .where('student_enrollment.course_section_id = :courseSectionId', {
        courseSectionId,
      })
      .select([
        'student.student_id',
        'semester.semester_id',
        'student_enrollment.course_section_id',
        'student_enrollment.pass_status',
        'student.student_code',
        'student.student_name',
        'student.student_email',
        'score',
      ])
      .getRawMany();

    const courseSection = await this.courseSectionRepository.findOne({
      where: { course_section_id: courseSectionId },
      relations: { semester: true },
    });

    const semester = await this.semesterService.findOne(
      courseSection.semester.semester_id,
    );

    return {
      courseSection,
      semester,
      students,
    };
  }

  async findBySemesterIdAndCourseId(semester_id: number, course_id: number) {
    const courseSection = await this.courseSectionRepository.findOne({
      where: {
        semester: { semester_id: semester_id },
        course: { course_id: course_id },
      },
    });

    if (!courseSection) {
      throw new HttpException(
        'Không tìm thấy lớp học phần',
        HttpStatus.NOT_FOUND,
      );
    }

    return courseSection;
  }

  async updateCurrentStudents(courseSection: CourseSection) {
    await this.courseSectionRepository.save(courseSection);
  }

  // sửa lại sau. Lấy đúng Repository mà thao tác
  async findStudentByNameInCourseSection(
    courseSectionId: number,
    studentName: string,
  ) {
    if (!studentName) {
      return await this.findAllStudentsAndScoreInCourseSection(courseSectionId);
    }

    const students = await this.studentEnrollmentRepository
      .createQueryBuilder('student_enrollment')
      .innerJoin('student_enrollment.studentSemester', 'student_semester')
      .innerJoin('student_semester.student', 'student')
      .innerJoin('student_semester.semester', 'semester')
      .innerJoinAndSelect('student_enrollment.score', 'score')
      .where('student_enrollment.course_section_id = :courseSectionId', {
        courseSectionId,
      })
      .andWhere('student.student_name LIKE :studentName', {
        studentName: `%${studentName}%`,
      })
      .select([
        'student.student_id',
        'semester.semester_id',
        'student_enrollment.course_section_id',
        'student_enrollment.pass_status',
        'student.student_code',
        'student.student_name',
        'student.student_email',
        'score',
      ])
      .getRawMany();

    const courseSection = await this.courseSectionRepository.findOne({
      where: { course_section_id: courseSectionId },
      relations: { semester: true },
    });

    const semester = await this.semesterService.findOne(
      courseSection.semester.semester_id,
    );

    return {
      courseSection,
      semester,
      students,
    };
  }

  async searchCourseSectionTeachingInSemester(
    auth: any,
    semesterId: number,
    courseSectionName: string,
  ) {
    return await this.courseSectionRepository
      .createQueryBuilder('course_section')
      .leftJoinAndSelect('course_section.semester', 'semester')
      .leftJoinAndSelect('course_section.course', 'course')
      .leftJoinAndSelect('course_section.teacher', 'teacher')
      .where('teacher.teacher_id = :teacherId', { teacherId: auth.id })
      .andWhere('semester.semester_id = :semesterId', { semesterId })
      .andWhere('course_section.course_section_name LIKE :courseSectionName', {
        courseSectionName: `%${courseSectionName}%`,
      })
      .select(['course_section', 'semester', 'course'])
      .getMany();
  }

  async completeCourseSection(courseSectionId: number, auth: any) {
    const courseSection = await this.courseSectionRepository
      .createQueryBuilder('course_section')
      .innerJoin('course_section.teacher', 'teacher')
      .innerJoinAndSelect("course_section.student_enrollments", "student_enrollments")
      .innerJoinAndSelect("student_enrollments.score", "score")
      .where('course_section.course_section_id = :courseSectionId', {
        courseSectionId,
      })
      .andWhere('teacher.teacher_id = :teacherId', { teacherId: auth.id }).getOne();

    if (!courseSection) {
      throw new HttpException("Không tìm thấy học phần", HttpStatus.NOT_FOUND);
    }

    if (courseSection.course_section_status === CourseSectionStatusEnum.COMPLETED) {
      throw new HttpException("Học phần đã hoàn thành cập nhật", HttpStatus.CONFLICT);
    }

    const isNotEligibleForComplete = courseSection.student_enrollments.some((item: any) => {
      return item.score.total_score === null;
    });
    
    if (isNotEligibleForComplete || courseSection.course_section_status === CourseSectionStatusEnum.NOT_STARTED) {
      throw new HttpException("Không đủ điều kiện xác nhận hoàn thành học phần", HttpStatus.CONFLICT);
    }

    courseSection.course_section_status = CourseSectionStatusEnum.COMPLETED;

    await this.courseSectionRepository.save(courseSection);

    return "success"
  }

  async searchCourseSectionInSemester(semesterId: number, courseSectionName: string) {
    return await this.courseSectionRepository
      .createQueryBuilder('course_section')
      .leftJoinAndSelect('course_section.semester', 'semester')
      .leftJoinAndSelect('course_section.course', 'course')
      .leftJoinAndSelect('course_section.teacher', 'teacher')
      .where('semester.semester_id = :semesterId', { semesterId })
      .andWhere('course_section.course_section_name LIKE :courseSectionName', {
        courseSectionName: `%${courseSectionName}%`,
      })
      .select(['course_section', 'semester', 'course', 'teacher'])
      .getMany();
  }

  async reopenCourseSection(courseSectionId: number, auth: any) {
    const courseSection = await this.courseSectionRepository.findOne({where: {course_section_id: courseSectionId}, relations: {semester: true}});

    if (!courseSection) {
      throw new HttpException("Không tìm thấy lớp học phần", HttpStatus.NOT_FOUND);
    }

    if (courseSection.course_section_status === CourseSectionStatusEnum.IN_PROGRESS) {
      throw new HttpException("Lớp học phần hiện đang không khóa", HttpStatus.CONFLICT);
    }

    if (courseSection.semester.semester_status === SemesterStatusEnum.COMPLETED) {
      throw new HttpException("Không thể mở khóa lớp học phần", HttpStatus.CONFLICT);
    }

    courseSection.course_section_status = CourseSectionStatusEnum.IN_PROGRESS;

    await this.courseSectionRepository.save(courseSection);

    return "success";
  }

  // điều chỉnh lại kiểm tra số lượng sinh viên trước khi mở
  async openCourseSection(courseSectionId: number, auth: any) {
    const courseSection = await this.courseSectionRepository.findOne({where: {course_section_id: courseSectionId}, relations: {semester: true, student_enrollments: true}});

    if (!courseSection) {
      throw new HttpException("Không tìm thấy lớp học phần", HttpStatus.NOT_FOUND);
    }

    if (courseSection.course_section_status === CourseSectionStatusEnum.IN_PROGRESS) {
      throw new HttpException("Lớp học phần hiện đang không khóa", HttpStatus.CONFLICT);
    }

    if (courseSection.semester.semester_status === SemesterStatusEnum.NOT_STARTED) {
      throw new HttpException("Không thể mở khóa lớp học phần này do học kì chưa được mở", HttpStatus.CONFLICT);
    }

    if (courseSection.student_enrollments.length === 0) {
      throw new HttpException("Không thể mở khóa lớp học phần này do chưa đủ số lượng sinh viên", HttpStatus.CONFLICT);
    }

    courseSection.course_section_status = CourseSectionStatusEnum.IN_PROGRESS;

    await this.courseSectionRepository.save(courseSection);

    return "success";
  }
}
