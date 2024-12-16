import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { Cohort } from 'src/cohorts/entities/cohort.entity';
import { generateCode } from 'common/utils/generate-code.util';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Cohort)
    private readonly cohortRepository: Repository<Cohort>,
  ) {}

  async create(createClassDto: CreateClassDto) {
    const cohort = await this.cohortRepository.findOne({
      where: { cohort_id: createClassDto.cohort_id },
      relations: { classes: true },
    });

    if (!cohort) {
      throw new HttpException('Không tìm thấy niên khóa', HttpStatus.NOT_FOUND);
    }

    const isClassNameExistedInCohort = cohort.classes.some(
      (cls) => cls.class_name === createClassDto.class_name,
    );
    if (isClassNameExistedInCohort) {
      throw new HttpException(
        'Tên lớp học đã tồn tại trong cohort',
        HttpStatus.BAD_REQUEST,
      );
    }

    const classDisplayName = generateCode(createClassDto.class_name);
    const classCreated = this.classRepository.save({
      ...createClassDto,
      total_total_student: 0,
      cohort: cohort,
      class_code: classDisplayName,
    });

    return classCreated;
  }

  async findAll() {
    const classes = await this.classRepository.find()

    return classes;
  }

  async findOne(id: number) {
    const classFound = await this.classRepository
      .createQueryBuilder('class')
      .innerJoinAndSelect('class.cohort', 'cohort')
      .innerJoinAndSelect('class.students', 'students')
      .where('class.class_id = :id', {id})
      .select([
        'class',
        'cohort',
        'students.student_id',
        'students.student_code',
        'students.student_name',
        'students.student_email',
      ])
      .getOne();

    if (!classFound) {
      throw new HttpException('Không tìm thấy lớp học', HttpStatus.NOT_FOUND);
    }

    return classFound;
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    const isClassExisted = await this.classRepository.findOne({
      where: { class_id: id },
    });
    if (!isClassExisted) {
      throw new HttpException('Không tìm thấy lớp học', HttpStatus.NOT_FOUND);
    }

    const isClassNameExisted = await this.classRepository.findOne({
      where: { class_name: updateClassDto.class_name, class_id: Not(id) },
    });

    if (isClassNameExisted) {
      throw new HttpException('Tên lớp học đã tồn tại', HttpStatus.BAD_REQUEST);
    }

    const class_display_name_id = generateCode(updateClassDto.class_name);
    const classUpdated = await this.classRepository.save({
      ...isClassExisted,
      class_name: updateClassDto.class_name,
      class_display_name_id: class_display_name_id,
    });

    return classUpdated;
  }
}
