import { AddCourseValidationSchemaType } from "@/components/courses/schemas/add-course-validation-schema";
import { AxiosInstance } from "@/config/axios-instance"

export const CourseService = {
    getAllCourses: async() => {
        return await AxiosInstance.get("/courses");
    },

    createCourse: async(payload: AddCourseValidationSchemaType) => {
        return await AxiosInstance.post("/courses/create", payload);
    }
}