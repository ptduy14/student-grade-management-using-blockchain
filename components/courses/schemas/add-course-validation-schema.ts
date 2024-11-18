import { z } from "zod";

export const addCourseValidationSchema = z.object({
  course_name: z.string().min(1, { message: "Tên môn học không được trống" }),
  course_credits: z.coerce
    .number()
    .min(0, { message: "Số tín chỉ không được nhỏ hơn 0" }),
  course_des: z.string().min(1, { message: "Mô tả môn học không được trống" }),
});

export type AddCourseValidationSchemaType = z.infer<
  typeof addCourseValidationSchema
>;
