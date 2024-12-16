import { Test, TestingModule } from '@nestjs/testing';
import { StudentSemesterService } from './student-semester.service';

describe('StudentSemesterService', () => {
  let service: StudentSemesterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentSemesterService],
    }).compile();

    service = module.get<StudentSemesterService>(StudentSemesterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
