import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Not, Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { generateDisplayNameId } from 'common/utils/generate-display-name-id.util';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const isCourseExisted = await this.courseRepository.findOne({
      where: { course_name: createCourseDto.course_name },
    });

    if (isCourseExisted) {
      throw new HttpException('Tên môn học đã tồn tại', HttpStatus.BAD_REQUEST);
    }

    const course_display_name_id = generateDisplayNameId(
      createCourseDto.course_name,
    );

    const courseCreated = await this.courseRepository.save({
      course_display_name_id,
      ...createCourseDto,
    });

    return courseCreated;
  }

  async findAll() {
    return await this.courseRepository.find();
  }

  async findOne(id: number) {
    const course = await this.courseRepository.findOne({
      where: { course_id: id },
    });

    if (!course) {
      throw new HttpException('Không tìm thấy môn học', HttpStatus.NOT_FOUND);
    }

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    // Kiểm tra xem môn học đã tồn tại không
    const isCourseExisted = await this.courseRepository.findOne({
      where: { course_id: id },
    });

    if (!isCourseExisted) {
      throw new HttpException('Không tìm thấy môn học', HttpStatus.NOT_FOUND);
    }

    // Kiểm tra xem tên môn học đã tồn tại không, loại trừ môn học hiện tại
    const isCourseNameExisted = await this.courseRepository.findOne({
      where: {
        course_name: updateCourseDto.course_name,
        course_id: Not(id),
      },
    });

    if (isCourseNameExisted) {
      throw new HttpException('Tên môn học đã tồn tại', HttpStatus.BAD_REQUEST);
    }

    const course_display_name_id =
      isCourseExisted.course_name === updateCourseDto.course_name
        ? isCourseExisted.course_display_name_id
        : generateDisplayNameId(updateCourseDto.course_name);

    const courseUpdated = await this.courseRepository.save({
      ...isCourseExisted,
      course_name: updateCourseDto.course_name,
      course_des: updateCourseDto.course_des,
      course_display_name_id,
    });

    return courseUpdated;
  }

  // need to improve later
  async remove(id: number) {
    try {
      await this.courseRepository.delete({course_id: id});
      return "Xóa môn học thành công";
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
