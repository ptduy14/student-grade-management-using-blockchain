// src/interfaces/grade.interface.ts
export interface Grade {
    courseSectionId: string;
    isExisted: boolean;
    scores: {
      midterm: string;
      finalExam: string;
      practical: string;
      average: string;
      isMidtermSet: boolean;
      isFinalExamSet: boolean;
      isPracticalSet: boolean;
    }
  }