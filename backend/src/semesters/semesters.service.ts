import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { Repository } from 'typeorm';
import { SemesterStatusEnum } from 'common/enums/semester-status.enum';
import { CourseSection } from 'src/course-section/entities/course-section.entity';
import { CourseSectionStatusEnum } from 'common/enums/course-section-status.enum';
import { StudentSemesterService } from 'src/student-semester/student-semester.service';

@Injectable()
export class SemestersService {
  constructor(
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
    private readonly studentSemesterService: StudentSemesterService,
  ) {}

  async findAll() {
    return await this.semesterRepository.find({
      relations: { academic_year: true },
    });
  }

  async findOne(id: number) {
    const semester = await this.semesterRepository.findOne({
      where: { semester_id: id },
      relations: { academic_year: true },
    });

    if (!semester) {
      throw new HttpException(
        'Không tìm thấy thông tin học kì',
        HttpStatus.NOT_FOUND,
      );
    }

    return semester;
  }

  async openSemester(semester_id: number) {
    const isCurrentSemesterIsOpen = await this.semesterRepository.findOne({
      where: { semester_status: SemesterStatusEnum.IN_PROGRESS },
    });

    if (isCurrentSemesterIsOpen) {
      throw new HttpException(
        'Không thể mở thêm học kì hiện tại',
        HttpStatus.CONFLICT,
      );
    }

    const semester = await this.semesterRepository.findOne({
      where: { semester_id: semester_id },
      relations: { courseSections: true },
    });

    // kiểm tra nếu không có học phần nào thì cũng không được mở
    const isHaveAnyCourseSections = semester.courseSections.length > 0;

    if (!isHaveAnyCourseSections) {
      throw new HttpException(
        'Không thể mở học kì do chưa có học phần nào được đăng ký',
        HttpStatus.CONFLICT,
      );
    }

    semester.semester_status = SemesterStatusEnum.IN_PROGRESS;

    await this.semesterRepository.save(semester);

    return "success"
  }

  async findCurrentOpenSemester() {
    const currentOpenSemester = await this.semesterRepository.findOne({
      where: { semester_status: SemesterStatusEnum.IN_PROGRESS },
    });

    if (!currentOpenSemester) {
      throw new HttpException(
        'Không tìm thấy học kỳ đang mở',
        HttpStatus.CONFLICT,
      );
    }

    return currentOpenSemester;
  }

  async completeSemester(semesterId: number) {
    const semester = await this.semesterRepository.findOne({
      where: { semester_id: semesterId },
      relations: { courseSections: true },
    });

    if (!semester) {
      throw new HttpException('Không tìm thấy học kỳ', HttpStatus.NOT_FOUND);
    }

    if (semester.semester_status === SemesterStatusEnum.COMPLETED) {
      throw new HttpException('Học kỳ đã hoàn tất', HttpStatus.CONFLICT);
    }

    const isNotEligibleForComplete = semester.courseSections.some(
      (CourseSection: any) =>
        CourseSection.course_section_status ===
          CourseSectionStatusEnum.IN_PROGRESS ||
        CourseSection.course_section_status ===
          CourseSectionStatusEnum.NOT_STARTED,
    );

    if (isNotEligibleForComplete || semester.courseSections.length === 0) {
      throw new HttpException(
        'Không đủ điều kiện hoàn thành học kỳ',
        HttpStatus.CONFLICT,
      );
    }

    semester.semester_status = SemesterStatusEnum.COMPLETED;

    await this.semesterRepository.save(semester);

    await this.studentSemesterService.calculateStudentsGPA(semesterId);
    return 'success';
  }
}
