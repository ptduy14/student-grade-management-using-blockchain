import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { TeacherDto } from './dto/teacher.dto';
import { plainToClass } from 'class-transformer';
import * as bcrypt from "bcrypt";

@Injectable()
export class TeachersService {
  constructor(@InjectRepository(Teacher) private readonly teacherRepository: Repository<Teacher>){}

  async create(createTeacherDto: CreateTeacherDto): Promise<TeacherDto> {
    const teacherFound = await this.findByEmail(createTeacherDto.teacher_email);

    if (teacherFound) {
      throw new HttpException('Email đã được sử dụng', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(createTeacherDto.teacher_password, 10);
    createTeacherDto.teacher_password = hashedPassword;

    const teacherCreated = await this.teacherRepository.save(createTeacherDto);
    console.log(plainToClass(TeacherDto, teacherCreated));
    return plainToClass(TeacherDto, teacherCreated);
  }

  findAll() {
    return `This action returns all teachers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacher`;
  }

  async findByEmail(email: string) {
    return await this.teacherRepository.findBy({teacher_email: email});
  }

  update(id: number, updateTeacherDto: UpdateTeacherDto) {
    return `This action updates a #${id} teacher`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacher`;
  }
}
