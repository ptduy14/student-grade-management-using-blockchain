import { z } from "zod";

export const studentSignInValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email không được trống" })
    .email({ message: "Địa chỉ email không hợp lệ" })
    .regex(/@student\.ctuet\.edu\.vn$/, { message: "Email phải có đuôi @student.ctuet.edu.vn" }),
  password: z.string().min(1, { message: "Mật khẩu không được trống" }),
});

export type StudentSignInValidationSchemaType = z.infer<
  typeof studentSignInValidationSchema
>;
