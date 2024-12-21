import { z } from "zod";

export const teacherSignInValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email không được trống" })
    .email({ message: "Địa chỉ email không hợp lệ" })
    .regex(/@ctuet\.edu\.vn$/, { message: "Email phải có đuôi @ctuet.edu.vn" }),
  password: z.string().min(1, { message: "Mật khẩu không được trống" }),
});

export type TeacherSignInValidationSchemaType = z.infer<
  typeof teacherSignInValidationSchema
>;
