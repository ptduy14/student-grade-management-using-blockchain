import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { Repository } from 'typeorm';
import { SemesterStatusEnum } from 'common/enums/semester-status.enum';

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
    const isCurrentSemesterIsOpen = await this.semesterRepository.findOne({where: {semester_status: SemesterStatusEnum.IN_PROGRESS}});
    if (isCurrentSemesterIsOpen) {
      throw new HttpException("Không thể mở thêm học kì hiện tại", HttpStatus.CONFLICT);
    }
    
    const semester = await this.semesterRepository.findOne({where: {semester_id: semester_id}});
    return await this.semesterRepository.save({...semester, semester_status: SemesterStatusEnum.IN_PROGRESS});
  }
}
