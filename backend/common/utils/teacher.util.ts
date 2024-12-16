import { removeVietnameseTones } from "./remove-vietnamse-tones"; 

export const TeacherUtil = {
  generateTeacherEmail: (teacher_name: string, count: number) => {
    const nameParts = removeVietnameseTones(teacher_name).split(' ');

    const stringNameConvert =
      nameParts
        .slice(0, -1)
        .map((item: string) => item.charAt(0).toLowerCase())
        .join('') + nameParts[nameParts.length - 1].toLowerCase();

    return stringNameConvert + count + '@ctuet.edu.vn';
  },
};
