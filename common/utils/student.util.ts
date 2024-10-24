export const StudentUtil = {
  generateStudentCode: (enrollment_year: number, total_student: number) => {
    return enrollment_year + total_student.toString().padStart(4, '0');
  },

  generateStudentEmail: (student_name: string, student_code: string) => {
    const stringNameConvert = student_name
      .split(' ')
      .map((item: string) => item.charAt(0).toLowerCase())
      .join('');

    return stringNameConvert + student_code;
  },
};
