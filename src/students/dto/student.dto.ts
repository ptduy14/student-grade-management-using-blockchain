import { Exclude, Expose } from 'class-transformer';

export class StudentDto {
  @Expose({ name: 'student_id' })
  id: number;

  @Expose({ name: 'student_name' })
  name: string;

  @Expose({ name: 'student_email' })
  email: string;

  @Expose({ name: 'student_phone' })
  phone: string;

  @Expose({ name: 'student_address' })
  address: string;

  @Exclude()
  student_password: string;
}
