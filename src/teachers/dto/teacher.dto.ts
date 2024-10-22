import { TeacherRoleEnum } from 'common/enums/teacher-role.enum';
import { Exclude, Expose } from 'class-transformer';

export class TeacherDto {
  @Expose({ name: 'teacher_id' }) 
  id: number;
  
  @Expose({ name: 'teacher_name' })
  name: string;

  @Expose({ name: 'teacher_email' })
  email: string;

  @Exclude()
  teacher_password: string;

  @Expose({ name: 'teacher_role' })
  role: TeacherRoleEnum;
}
