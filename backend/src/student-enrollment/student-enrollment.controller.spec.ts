import { Test, TestingModule } from '@nestjs/testing';
import { StudentEnrollmentController } from './student-enrollment.controller';
import { StudentEnrollmentService } from './student-enrollment.service';

describe('StudentEnrollmentController', () => {
  let controller: StudentEnrollmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentEnrollmentController],
      providers: [StudentEnrollmentService],
    }).compile();

    controller = module.get<StudentEnrollmentController>(StudentEnrollmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
