import { AxiosInstance } from "@/config/axios-instance";

export const courseSectionService = {
  getAllCourseSectionInSemester: async (semesterId: string) => {
    return await AxiosInstance.get(`/course-section/semesters/${semesterId}`);
  },

  getCourseSectionTeachingInSemester: async (semesterId: string) => {
    return await AxiosInstance.get(
      `/course-section/teacher/semesters/${semesterId}`
    );
  },

  getCourseSectionWithStudentAndScore: async (courseSectionId: string) => {
    return await AxiosInstance.get(
      `/course-section/${courseSectionId}/students-with-score`
    );
  },

  findStudentByName: async (courseSectionId: string, studentName: string) => {
    return await AxiosInstance.get(
      `/course-section/${courseSectionId}/search/student`,
      {
        params: {
          student_name: studentName,
        },
      }
    );
  },

  searchCourseSectionTeachingInSemester: async (
    semesterId: string,
    courseSectionName: string
  ) => {
    return await AxiosInstance.get(
      `/course-section/teacher/semesters/${semesterId}/search`,
      {
        params: {
          course_section_name: courseSectionName,
        },
      }
    );
  },

  completeCourseSection: async (courseSectionId: string) => {
    return await AxiosInstance.get(
      `/course-section/${courseSectionId}/complete`
    );
  },

  searchCourseSectionInSemester: async (
    semesterId: string,
    course_section_name: string
  ) => {
    return await AxiosInstance.get(
      `/course-section/semesters/${semesterId}/search`,
      {
        params: {
          course_section_name: course_section_name,
        },
      }
    );
  },

  openCourseSection: async (courseSectionId: string) => {
    return await AxiosInstance.get(`/course-section/${courseSectionId}/open`);
  },

  reopenCourseSection: async (courseSectionId: string) => {
    return await AxiosInstance.get(`/course-section/${courseSectionId}/reopen`);
  },

  createCourseSection: async(payload: any) => {
    return await AxiosInstance.post("/course-section", payload);
  }
};
