import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง").trim(),
  phone: z.string()
    .min(1, "กรุณากรอกเบอร์โทรศัพท์")
    .max(10, "เบอร์โทรศัพท์ไม่ควรเกิน 10 หลัก")
    .regex(/^\d+$/, "กรุณากรอกเบอร์โทรศัพท์ที่เป็นตัวเลขเท่านั้น"),
  taxId: z.string()
    .min(1, "กรุณากรอกเลขทะเบียนสรรพสามิต")
    .regex(/^\d+$/, "กรุณากรอกเลขทะเบียนสรรพสามิตที่เป็นตัวเลขเท่านั้น"),
  password: z.string().min(6, "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร"),
  confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่าน"),
  companyName: z.string().min(1, "กรุณากรอกชื่อบริษัท").trim(),
  location: z.string().min(1, "กรุณากรอกสถานที่ตั้ง").trim(),
  
  province: z.string().nullable().refine(value => value != null && value.length > 0, {
    message: "กรุณาเลือกจังหวัด",
  }),
  
  district: z.string().nullable().refine(value => value != null && value.length > 0, {
    message: "กรุณาเลือกอำเภอ",
  }),
  
  subdsitrict: z.string().nullable().refine(value => value != null && value.length > 0, {
    message: "กรุณากรอกตำบล",
  }),
  
  postcode: z.string().min(1, "กรุณากรอกรหัสไปรษณีย์").trim()
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
