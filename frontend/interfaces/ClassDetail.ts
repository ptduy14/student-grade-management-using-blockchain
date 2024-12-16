import { IClass } from "./Class";
import { ICohort } from "./Cohort";

export interface IClassDetail extends IClass {
  cohort: ICohort;
  students: {
    student_id: number;
    student_code: string;
    student_name: string;
    student_email: string;
  }[];
}
