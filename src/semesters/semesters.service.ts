import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { Repository } from 'typeorm';
import { SemesterStatusEnum } from 'common/enums/semester-status.enum';
import { CourseSection } from 'src/course-section/entities/course-section.entity';
import { CourseSectionStatusEnum } from 'common/enums/course-section-status.enum';

@Injectable()
export class SemestersService {
  constructor(
    @InjectRepository(Semester)
    private readonly semesterRepository: Repository<Semester>,
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
    });
    return await this.semesterRepository.save({
      ...semester,
      semester_status: SemesterStatusEnum.IN_PROGRESS,
    });
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
    const semester = await this.semesterRepository.findOne({where: {semester_id: semesterId}, relations: {courseSections: true}});
  
    if (!semester) {
      throw new HttpException("Không tìm thấy học kỳ", HttpStatus.NOT_FOUND);
    }

    if (semester.semester_status === SemesterStatusEnum.COMPLETED) {
      throw new HttpException("Học kỳ đã hoàn tất", HttpStatus.CONFLICT);
    }

    const isNotEligibleForComplete = semester.courseSections.some((CourseSection: any) => CourseSection.course_section_status === CourseSectionStatusEnum.IN_PROGRESS);

    if (isNotEligibleForComplete) {
      throw new HttpException("Không đủ điều kiện hoàn thành học kỳ", HttpStatus.CONFLICT);
    }

    semester.semester_status = SemesterStatusEnum.COMPLETED

    await this.semesterRepository.save(semester);

    return "success";
  }
}
