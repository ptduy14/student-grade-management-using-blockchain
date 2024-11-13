export enum CourseSectionStatusEnum {
    NOT_STARTED = "Not Started",  // Chưa bắt đầu
    IN_PROGRESS = "In Progress",  // Đang diễn ra
    COMPLETED = "Completed",      // Đã hoàn thành
  }
  
  interface CourseSectionStatusNamesType {
    [key: string]: string;
  }
  
  export const CourseSectionStatusNames: CourseSectionStatusNamesType = {
    [CourseSectionStatusEnum.NOT_STARTED]: "Chưa bắt đầu",
    [CourseSectionStatusEnum.IN_PROGRESS]: "Đang diễn ra",
    [CourseSectionStatusEnum.COMPLETED]: "Đã hoàn thành",
  }
  