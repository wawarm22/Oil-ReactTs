import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง").trim(),
  phone: z.string()
    .min(1, "กรุณากรอกเบอร์โทรศัพท์")
    .max(10, "เบอร์โทรศัพท์ไม่ควรเกิน 10 หลัก")
    .regex(/^\d+$/, "กรุณากรอกเบอร์โทรศัพท์ที่เป็นตัวเลขเท่านั้น"),
  tax_registration: z.string()
    .min(1, "กรุณากรอกเลขทะเบียนสรรพสามิต")
    .regex(/^\d+$/, "กรุณากรอกเลขทะเบียนสรรพสามิตที่เป็นตัวเลขเท่านั้น"),
  password: z.string()
    .min(8, "รหัสผ่านต้องมีความยาวไม่น้อยกว่า 8 ตัวอักษร")
    .max(16, "รหัสผ่านต้องมีความยาวไม่เกิน 16 ตัวอักษร")
    .regex(/[A-Z]/, "รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษพิมพ์ใหญ่")
    .regex(/[a-z]/, "รหัสผ่านต้องมีตัวอักษรภาษาอังกฤษพิมพ์เล็ก")
    .regex(/\d/, "รหัสผ่านต้องมีตัวเลข"),
  confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่าน"),
  company_name: z.string().min(1, "กรุณากรอกชื่อบริษัท").trim(),
  factory_name: z.union([
    z.string().min(1, "กรุณาเลือกโรงงาน"),
    z.array(z.string().min(1)).min(1, "กรุณาเลือกโรงงานอย่างน้อย 1 รายการ")
  ]),  
  address: z.string().min(1, "กรุณากรอกสถานที่ตั้ง").trim(),
  road: z.string().optional(),
  alley: z.string().optional(),
  village: z.string().optional(),
  province: z.string().nullable().refine(value => value != null && value.length > 0, {
    message: "กรุณาเลือกจังหวัด",
  }),

  district: z.string().nullable().refine(value => value != null && value.length > 0, {
    message: "กรุณาเลือกอำเภอ",
  }),

  subdistrict: z.string().nullable().refine(value => value != null && value.length > 0, {
    message: "กรุณากรอกตำบล",
  }),

  zip_code: z.string().min(1, "กรุณากรอกรหัสไปรษณีย์").trim()
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
