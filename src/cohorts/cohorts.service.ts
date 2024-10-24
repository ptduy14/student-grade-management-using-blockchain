import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cohort } from './entities/cohort.entity';

@Injectable()
export class CohortsService {
  constructor(@InjectRepository(Cohort) private readonly cohortRepository: Repository<Cohort>) {}

  async create(createCohortDto: CreateCohortDto) {
    const latestCohort = await this.cohortRepository.findOne({where: {}, order: {createdAt: 'DESC'}});

    if (latestCohort) {
      createCohortDto.cohort_name = `Khóa ${latestCohort.cohort_number + 1}`;
      createCohortDto.cohort_number = latestCohort.cohort_number + 1;
      createCohortDto.enrollment_year = latestCohort.enrollment_year + 1; 
    } else {
      createCohortDto.cohort_name = "Khóa 1"
      createCohortDto.cohort_number = 1
      createCohortDto.enrollment_year = 2024
    }

    const cohortCreated = await this.cohortRepository.save(createCohortDto);

    return cohortCreated;
  }

  async findAll() {
    return this.cohortRepository.find({relations: {classes: true}});
  }

  async findOne(id: number) {
    const cohort = await this.cohortRepository.findOne({where: {cohort_id: id}, relations: {classes: true}});

    if (!cohort) {
      throw new HttpException("Không tìm thấy dữ liệu", HttpStatus.NOT_FOUND);
    }
    
    return cohort;
  }

  // update(id: number, updateCohortDto: UpdateCohortDto) {
  //   return `This action updates a #${id} cohort`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} cohort`;
  // }
}
