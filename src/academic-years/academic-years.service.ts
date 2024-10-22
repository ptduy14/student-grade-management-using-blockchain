import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAcademicYearDto } from './dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from './dto/update-academic-year.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AcademicYear } from './entities/academic-year.entity';

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
    });
    return academicYear;
  }

  async findAll() {
    const academicYears = await this.academicYearService.find();
    return academicYears
  }

  async findOne(id: number) {
    const academicYear = await this.academicYearService.findOne({where: {academic_year_id: id}});
    if (!academicYear) {
      throw new HttpException("Không tìm thấy năm học", HttpStatus.NOT_FOUND);
    }
    
    return academicYear;
  }

  // update(id: number, updateAcademicYearDto: UpdateAcademicYearDto) {
  //   return `This action updates a #${id} academicYear`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} academicYear`;
  // }
}
