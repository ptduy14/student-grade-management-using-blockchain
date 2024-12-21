import { PartialType } from '@nestjs/swagger';
import { CreateStudentSemesterDto } from './create-student-semester.dto';

export class UpdateStudentSemesterDto extends PartialType(CreateStudentSemesterDto) {}
