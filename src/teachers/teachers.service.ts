import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { TeacherDto } from './dto/teacher.dto';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<TeacherDto> {
    const teacherFound = await this.findByEmail(createTeacherDto.teacher_email);

    if (teacherFound) {
      throw new HttpException('Email đã được sử dụng', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(
      createTeacherDto.teacher_password,
      10,
    );
    createTeacherDto.teacher_password = hashedPassword;

    const teacherCreated = await this.teacherRepository.save(createTeacherDto);
    return plainToClass(TeacherDto, teacherCreated);
  }

  async findAll() {
    const teachers = await this.teacherRepository.find({
      select: ['teacher_id', 'teacher_name', 'teacher_email', 'teacher_role'],
    });

    return teachers;
  }

  async findOne(id: number) {
    const teacher = await this.teacherRepository.findOne({
      where: { teacher_id: id },
      select: ['teacher_id', 'teacher_name', 'teacher_email', 'teacher_role'],
    });

    if (!teacher) {
      throw new HttpException(
        'Không tìm thấy giảng viên',
        HttpStatus.NOT_FOUND,
      );
    }

    return teacher;
  }

  async findByEmail(email: string) {
    return await this.teacherRepository.findOne({
      where: { teacher_email: email },
    });
  }

  async updatePassword(teacher: any) {
    return await this.teacherRepository.save(teacher);
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    const updatedTeacher = { teacher_id: id, ...updateTeacherDto };

    const teacherFound = await this.teacherRepository.findOneBy({ teacher_id: id });
    if (!teacherFound) {
      throw new HttpException(`Không tìm thấy giảng viên`, HttpStatus.NOT_FOUND);
    }

    const result = await this.teacherRepository.save(updatedTeacher);

    return result;
  }

  // need to improve later
  async remove(id: number) {
    try {
      await this.teacherRepository.delete({teacher_id: id});
      return "Xóa tài khoản thành công";
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
