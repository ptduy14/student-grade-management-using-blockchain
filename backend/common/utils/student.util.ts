import { removeVietnameseTones } from "./remove-vietnamse-tones"; 

export const StudentUtil = {
  generateStudentCode: (enrollment_year: number, total_student: number) => {
    return enrollment_year + total_student.toString().padStart(4, '0');
  },

  generateStudentEmail: (student_name: string, student_code: string) => {
    const nameParts = removeVietnameseTones(student_name).split(' ');

    const stringNameConvert = nameParts
    .slice(0, -1)
    .map((item: string) => item.charAt(0).toLowerCase()) 
    .join('') + nameParts[nameParts.length - 1].toLowerCase();

    return stringNameConvert + student_code + '@student.ctuet.edu.vn';
  },
};
