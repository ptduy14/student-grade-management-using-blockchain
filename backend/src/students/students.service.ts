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
import { plainToClass } from 'class-transformer';
import { StudentDto } from './dto/student.dto';
import { StudentSemester } from 'src/student-semester/entities/student-semester.entity';
import { AcademicYearsService } from 'src/academic-years/academic-years.service';
import { UserRoleEnum } from 'common/enums/user-role.enum';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Cohort)
    private readonly cohortRepository: Repository<Cohort>,
    @InjectRepository(StudentSemester)
    private readonly studentSemesterRepository: Repository<StudentSemester>,
    private readonly academicYearsService: AcademicYearsService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const cohort = await this.cohortRepository.findOne({
      where: { cohort_id: createStudentDto.cohort_id },
      relations: { classes: true },
    });

    if (!cohort) {
      throw new HttpException('Không tìm thấy niên khóa', HttpStatus.NOT_FOUND);
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

    const hashedPassword = await bcrypt.hash(
      createStudentDto.student_password,
      10,
    );

    const studentCreated = await this.studentRepository.save({
      ...createStudentDto,
      student_code: studentCode,
      student_email: studentEmail,
      class: classStudentToAdded,
      student_password: hashedPassword,
      student_role: UserRoleEnum.STUDENT,
    });

    const academicYears = await this.academicYearsService.findAll();
    const studentSemesters = academicYears.flatMap((academicYear) =>
      academicYear.semesters.map((semester) => ({
        student: studentCreated,
        semester,
        registration_credits: 0, // Giá trị mặc định
        gpa: 0, // Giá trị mặc định
      })),
    );

    // Sử dụng `Promise.all` để lưu tất cả các student semester
    await Promise.all(
      studentSemesters.map((studentSemester) =>
        this.studentSemesterRepository.save(studentSemester),
      ),
    );

    return plainToClass(StudentDto, studentCreated);
  }

  async findByEmail(email: string) {
    const student = await this.studentRepository.findOne({
      where: { student_email: email },
    });

    if (!student) {
      throw new HttpException('Không tìm thấy tài khoản', HttpStatus.NOT_FOUND);
    }

    return student;
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

    if (student.student_name === updateStudentDto.student_name) {
      const studentEmail = StudentUtil.generateStudentEmail(
        updateStudentDto.student_name,
        student.student_code,
      );

      student.student_email = studentEmail;
    }

    const studentUpdated = this.studentRepository.save({
      ...student,
      ...updateStudentDto,
    });

    return studentUpdated;
  }

  async updatePassword(teacher: any) {
    return await this.studentRepository.save(teacher);
  }

  async searchByName(studentName: string) {
    const students = await this.studentRepository
      .createQueryBuilder('students')
      .innerJoinAndSelect("students.class", "class")
      .where('students.student_name LIKE :studentName', {
        studentName: `%${studentName}%`,
      })
      .select([
        'students.student_id',
        'students.student_code',
        'students.student_name',
        'students.student_email',
        'students.student_phone',
        'students.student_address',
        'class'
      ])
      .getMany();

    return students;
  }
}
