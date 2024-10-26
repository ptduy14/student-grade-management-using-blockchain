import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseSectionDto } from './dto/create-course-section.dto';
import { UpdateCourseSectionDto } from './dto/update-course-section.dto';
import { SemestersService } from 'src/semesters/semesters.service';
import { CoursesService } from 'src/courses/courses.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { TeacherRoleEnum } from 'common/enums/teacher-role.enum';
import { SemesterStatusEnum } from 'common/enums/semester-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseSection } from './entities/course-section.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CourseSectionService {
  constructor(
    @InjectRepository(CourseSection)
    private readonly courseSectionRepository: Repository<CourseSection>,
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
      await this.semesterService.openSemester(semester.semester_id);
    }

    if (teacher.teacher_role === TeacherRoleEnum.ADMIN) {
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

  update(id: number, updateCourseSectionDto: UpdateCourseSectionDto) {
    return `This action updates a #${id} courseSection`;
  }

  remove(id: number) {
    return `This action removes a #${id} courseSection`;
  }
}
