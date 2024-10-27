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

    if (semester.semester_status === SemesterStatusEnum.NOT_STARTED) {
      throw new HttpException('Học kì này hiện chưa mở', HttpStatus.CONFLICT);
      // await this.semesterService.openSemester(semester.semester_id);
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
    .where('semester.semester_id = :id', {id})
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
    .where('teacher.teacher_id = :id', {id: auth.id})
    .select([
      'course_section',
      'semester',
      'course',
    ])
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
    .select([
      'course_section',
      'semester',
      'course',
    ])
    .getMany();
  }

  async findOne(id: number) {
    const courseSection = await this.courseSectionRepository
    .createQueryBuilder('course_section')
    .leftJoinAndSelect('course_section.semester', 'semester')
    .leftJoinAndSelect('course_section.course', 'course')
    .leftJoinAndSelect('course_section.teacher', 'teacher')
    .where("course_section.course_section_id = :id", {id})
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

  async findAllStudentsInCourseSection(courseSectionId: number) {
    return await this.studentEnrollmentRepository
      .createQueryBuilder('student_enrollment')
      .innerJoin('student_enrollment.studentSemester', 'student_semester')
      .innerJoin('student_semester.student', 'student')
      .innerJoin('student_semester.semester', 'semester')
      .where('student_enrollment.course_section_id = :courseSectionId', { courseSectionId })
      .select([
        'student.student_id',
        'semester.semester_id',
        'student_enrollment.course_section_id',
        'student.student_name',
        'student.student_email',
      ])
      .getRawMany();
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
}
