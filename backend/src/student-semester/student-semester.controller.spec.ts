import { Test, TestingModule } from '@nestjs/testing';
import { StudentSemesterController } from './student-semester.controller';
import { StudentSemesterService } from './student-semester.service';

describe('StudentSemesterController', () => {
  let controller: StudentSemesterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentSemesterController],
      providers: [StudentSemesterService],
    }).compile();

    controller = module.get<StudentSemesterController>(StudentSemesterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
