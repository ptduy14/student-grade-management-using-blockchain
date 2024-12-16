import { IClass } from "./Class";

export interface IStudent {
  student_id: number;
  student_code: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  student_address: string;
  class: IClass;
}
