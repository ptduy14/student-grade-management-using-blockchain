import { TeacherRoleEnum } from 'common/enums/teacher-role.enum';
import { Exclude, Expose } from 'class-transformer';

export class TeacherDto {
  @Expose()
  teacher_id: number;

  @Expose()
  teacher_name: string;

  @Expose()
  teacher_email: string;

  @Exclude()
  teacher_password: string;

  @Expose()
  teacher_role: TeacherRoleEnum;
}
