import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { Class } from 'src/classes/entities/class.entity';
import { Cohort } from 'src/cohorts/entities/cohort.entity';
import { StudentUtil } from 'common/utils/student.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Cohort)
    private readonly cohortRepository: Repository<Cohort>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const cohort = await this.cohortRepository.findOne({
      where: { cohort_id: createStudentDto.cohort_id },
      relations: { classes: true },
    });
    if (!cohort) {
      throw new HttpException('Không tìm thấy niên khóa', HttpStatus.NOT_FOUND);
    }

    const currentYear = new Date().getFullYear();
    if (cohort.enrollment_year !== currentYear) {
      throw new HttpException('Niên khóa không hợp lệ', HttpStatus.BAD_REQUEST);
    }

    const isExistedClassInCohort = cohort.classes.some(
      (cls) => cls.class_id === createStudentDto.class_id,
    );
    if (!isExistedClassInCohort) {
      throw new HttpException(
        'Không tìm thấy thông tin lớp học',
        HttpStatus.NOT_FOUND,
      );
    }

    const total_student = cohort.classes.reduce((total, cls) => {
      return total + cls.total_student;
    }, 0);

    const studentCode = StudentUtil.generateStudentCode(
      cohort.enrollment_year,
      total_student,
    );
    const studentEmail = StudentUtil.generateStudentEmail(
      createStudentDto.student_name,
      studentCode,
    );

    const classStudentToAdded = cohort.classes.find(
      (cls) => cls.class_id === createStudentDto.class_id,
    );

    await this.classRepository.save({
      ...classStudentToAdded,
      total_student: classStudentToAdded.total_student + 1,
    });

    const hashedPassword = await bcrypt.hash(createStudentDto, 10);

    const studentCreated = await this.studentRepository.save({
      ...createStudentDto,
      student_code: studentCode,
      student_email: studentEmail,
      class: classStudentToAdded,
      student_password: hashedPassword,
    });

    return studentCreated;
  }

  async findAll() {
    return await this.studentRepository.find({
      relations: { class: true },
      select: [
        'student_id',
        'student_code',
        'student_name',
        'student_email',
        'student_phone',
        'student_address',
      ],
    });
  }

  async findOne(id: number) {
    const student = await this.studentRepository.findOne({
      where: { student_id: id },
      relations: { class: true },
      select: [
        'student_id',
        'student_code',
        'student_name',
        'student_email',
        'student_phone',
        'student_address',
      ],
    });

    if (!student) {
      throw new HttpException('Không tìm thấy sinh viên', HttpStatus.NOT_FOUND);
    }

    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const student = await this.studentRepository.findOne({
      where: { student_id: id },
    });

    if (!student) {
      throw new HttpException('Không tìm thấy sinh viên', HttpStatus.NOT_FOUND);
    }

    const studentEmail = StudentUtil.generateStudentEmail(
      updateStudentDto.student_name,
      student.student_code,
    );

    const studentUpdated = this.studentRepository.save({
      ...student,
      ...updateStudentDto,
      student_email: studentEmail,
    });

    return studentUpdated;
  }
}
