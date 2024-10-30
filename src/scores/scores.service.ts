import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { CourseSectionService } from 'src/course-section/course-section.service';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEnrollment } from 'src/student-enrollment/entities/student-enrollment.entity';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { ScoreTypeEnum } from 'common/enums/score-type.enum';
import { PassStatusEnum } from 'common/enums/pass-status.enum';

@Injectable()
export class ScoresService {
  constructor(
    private readonly courseSectionService: CourseSectionService,
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    @InjectRepository(StudentEnrollment)
    private readonly studentEnrollmentRepository: Repository<StudentEnrollment>,
  ) {}

  async create(auth: any, createScoreDto: CreateScoreDto) {
    const teacher = await this.courseSectionService.getTeacherFromCourseSection(
      auth.id,
      createScoreDto.course_section_id,
    );

    // kiểm tra sinh viên có đăng kí học phần này hay ko
    let enrollment = await this.studentEnrollmentRepository.findOne({
      where: {
        student_id: createScoreDto.student_id,
        semester_id: createScoreDto.semester_id,
        course_section_id: createScoreDto.course_section_id,
      },
      relations: ['score'],
    });

    if (!enrollment) {
      throw new HttpException('Không tìm thấy học phần', HttpStatus.NOT_FOUND);
    }

    // Cập nhật điểm theo loại
    if (createScoreDto.score_type === ScoreTypeEnum.MIDTERM) {
      if (enrollment.score.midterm_score) {
        throw new HttpException('Điểm giữa kì đã tồn tại', HttpStatus.CONFLICT);
      }

      enrollment.score.midterm_score = createScoreDto.score;
    } else if (createScoreDto.score_type === ScoreTypeEnum.FINAL) {
      if (!enrollment.score.midterm_score) {
        throw new HttpException(
          'Điểm giữa kì chưa tồn tại',
          HttpStatus.CONFLICT,
        );
      }

      if (enrollment.score.final_score) {
        throw new HttpException('Điểm giữa kì đã tồn tại', HttpStatus.CONFLICT);
      }

      enrollment.score.final_score = createScoreDto.score;
    }

    this.calculateTotalScore(enrollment);

    const enrollmentUpdated =
      await this.studentEnrollmentRepository.save(enrollment);

    return enrollmentUpdated;
  }

  calculateTotalScore(enrollment: any) {
    if (
      enrollment.score.midterm_score == null ||
      enrollment.score.final_score == null
    ) {
      return;
    }

    enrollment.score.total_score =
      enrollment.score.midterm_score * 0.4 + enrollment.score.final_score * 0.6;

    if (enrollment.score.total_score >= 4) {
      enrollment.pass_status = PassStatusEnum.PASS;
    } else {
      enrollment.pass_status = PassStatusEnum.FAIL;
    }
  }

  async update(auth: any, updateScoreDto: UpdateScoreDto) {
    const teacher = await this.courseSectionService.getTeacherFromCourseSection(
      auth.id,
      updateScoreDto.course_section_id,
    );

    // kiểm tra sinh viên có đăng kí học phần này hay ko
    let enrollment = await this.studentEnrollmentRepository.findOne({
      where: {
        student_id: updateScoreDto.student_id,
        semester_id: updateScoreDto.semester_id,
        course_section_id: updateScoreDto.course_section_id,
      },
      relations: ['score'],
    });

    if (!enrollment) {
      throw new HttpException('Không tìm thấy học phần', HttpStatus.NOT_FOUND);
    }

    if (updateScoreDto.score_type === ScoreTypeEnum.MIDTERM) {
      if (enrollment.score.midterm_score === null) {
        throw new HttpException(
          'Điểm giữa kì không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }

      enrollment.score.midterm_score = updateScoreDto.score
    } else if (updateScoreDto.score_type === ScoreTypeEnum.FINAL) {
      if (enrollment.score.final_score === null) {
        throw new HttpException(
          'Điểm cuối kì không tồn tại',
          HttpStatus.NOT_FOUND,
        );
      }

      enrollment.score.final_score = updateScoreDto.score
    }

    this.calculateTotalScore(enrollment);

    const enrollmentUpdated = await this.studentEnrollmentRepository.save(enrollment);

    return enrollmentUpdated;
  }
}
