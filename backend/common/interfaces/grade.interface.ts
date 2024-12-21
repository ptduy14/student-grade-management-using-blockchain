// src/interfaces/grade.interface.ts
export interface Grade {
  courseSectionId: number; // Chuyển từ string sang number để phù hợp với dữ liệu
  isExisted: boolean;
  scores: {
    midterm: string; // Điểm vẫn được giữ ở dạng string vì chúng được định dạng bằng .toFixed(2)
    finalExam: string;
    total: string;
    isMidtermSet: boolean;
    isFinalExamSet: boolean;
  };
}
