import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentSemester } from './entities/student-semester.entity';
import { Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { StudentsService } from 'src/students/students.service';

@Injectable()
export class StudentSemesterService {
  constructor(
    @InjectRepository(StudentSemester)
    private readonly studentSemesterRepository: Repository<StudentSemester>,
    private readonly studentService: StudentsService,
  ) {}

  // Lấy tất cả các bản ghi StudentSemester theo studentId
  async getAllStudentSemestersByStudentId(
    studentId: number,
  ): Promise<StudentSemester[]> {
    await this.studentService.findOne(studentId);

    return await this.studentSemesterRepository.find({
      where: { student: { student_id: studentId } },
      relations: ['semester'],
    });
  }

  // Lấy một học kỳ cụ thể của sinh viên dựa trên studentId và semesterId
  async getStudentSemesterByStudentIdAndSemesterId(studentId: number, semesterId: number): Promise<StudentSemester> {
    const studentSemester = await this.studentSemesterRepository.findOne({
        where: { student: { student_id: studentId }, semester: { semester_id: semesterId } },
        relations: ['semester'],
    });
    
    if (!studentSemester) {
        throw new HttpException(`Không tìm thấy dữ liệu`, HttpStatus.NOT_FOUND);
    }

    return studentSemester;
}
}
