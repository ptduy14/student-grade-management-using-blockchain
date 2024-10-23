import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicYear } from './entities/academic-year.entity';
import { SemesterNameEnum } from 'common/enums/semester-name.enum';
import { Cohort } from 'src/cohorts/entities/cohort.entity';

@Injectable()
export class AcademicYearsService {
  constructor(
    @InjectRepository(AcademicYear)
    private readonly academicYearRepository: Repository<AcademicYear>,

    @InjectRepository(Cohort)
    private readonly cohortRepository: Repository<Cohort>,
  ) {}

  async create(createAcademicYearDto: CreateAcademicYearDto) {
    const latestAcademicYear = await this.academicYearRepository.findOne({
      where: {},
      order: { createdAt: 'DESC' },
    });

    const academicYearStart = latestAcademicYear
      ? latestAcademicYear.academic_year_start + 1
      : await this.getFirstCohortStartYear();

    createAcademicYearDto.academic_year_start = academicYearStart;
    createAcademicYearDto.academic_year_end = academicYearStart + 1;

    const academicYearCreated = await this.academicYearRepository.save({
      ...createAcademicYearDto,
      semesters: [
        { semester_name: SemesterNameEnum.FIRST_TERM },
        { semester_name: SemesterNameEnum.SECOND_TERM },
        { semester_name: SemesterNameEnum.SUPPLEMENTARY_TERM },
      ],
    });

    return academicYearCreated;
  }

  async findAll() {
    const academicYears = await this.academicYearRepository.find({
      relations: { semesters: true },
    });
    return academicYears;
  }

  async findOne(id: number) {
    const academicYear = await this.academicYearRepository.findOne({
      where: { academic_year_id: id },
      relations: { semesters: true },
    });
    if (!academicYear) {
      throw new HttpException('Không tìm thấy năm học', HttpStatus.NOT_FOUND);
    }

    return academicYear;
  }

  // Hàm lấy năm bắt đầu từ cohort đầu tiên
  private async getFirstCohortStartYear(): Promise<number> {
    const firstCohort = await this.cohortRepository.findOne({
      where: {},
      order: { createdAt: 'ASC' },
    });

    if (!firstCohort) {
      throw new HttpException(
        'Không thể tạo niên khóa mới, vui lòng xem lại cohort module',
        HttpStatus.BAD_REQUEST,
      );
    }

    return firstCohort.enrollment_year;
  }
}
