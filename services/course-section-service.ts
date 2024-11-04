import { AxiosInstance } from "@/config/axios-instance"

export const courseSectionService = {
    getCourseSectionTeachingInSemester: async(semesterId: string) => {
        return await AxiosInstance.get(`/course-section/teacher/semesters/${semesterId}`);
    },

    getCourseSectionWithStudentAndScore: async(courseSectionId: string) => {
        return await AxiosInstance.get(`/course-section/${courseSectionId}/students-with-score`)
    }
}