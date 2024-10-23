import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicYear } from './entities/academic-year.entity';
import { SemesterNameEnum } from 'common/enums/semester-name.enum';

@Injectable()
export class AcademicYearsService {
  constructor(
    @InjectRepository(AcademicYear)
    private readonly academicYearService: Repository<AcademicYear>,
  ) {}

  async create(createAcademicYearDto: CreateAcademicYearDto) {
    const latestAcademicYear = await this.academicYearService.findOne({
      where: {},
      order: {
        createdAt: 'DESC',
      },
    });

    if (!latestAcademicYear) {
      const academic_year_start = 2020;
      const academic_year_end = academic_year_start + 1;

      const academicYear = await this.academicYearService.save({
        academic_year_start,
        academic_year_end,
      });
      return academicYear;
    }

    const academic_year_start = latestAcademicYear.academic_year_start + 1;
    const academic_year_end = academic_year_start + 1;

    const academicYear = await this.academicYearService.save({
      academic_year_start,
      academic_year_end,
      semesters: [
        { semester_name: SemesterNameEnum.FIRST_TERM },
        { semester_name: SemesterNameEnum.SECOND_TERM },
        { semester_name: SemesterNameEnum.SUPPLEMENTARY_TERM },
      ],
    });

    return academicYear;
  }

  async findAll() {
    const academicYears = await this.academicYearService.find({
      relations: { semesters: true },
    });
    return academicYears;
  }

  async findOne(id: number) {
    const academicYear = await this.academicYearService.findOne({
      where: { academic_year_id: id },
      relations: { semesters: true },
    });
    if (!academicYear) {
      throw new HttpException('Không tìm thấy năm học', HttpStatus.NOT_FOUND);
    }

    return academicYear;
  }
}
