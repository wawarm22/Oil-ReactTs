import { z } from "zod";
import dayjs from "dayjs";

export type AuthSchema = z.infer<typeof AuthSchema>
export const AuthSchema = z.object({
  user: z
    .object({
      id: z.number(),
      company_id: z.number(),
      email: z.string(),
      phone: z.string(),
      address_line_1: z.string().nullable(),
      address_line_2: z.string().nullable(),
      address_street: z.string().nullable(),
      alley: z.string().nullable(),
      village: z.string().nullable(),
      province_id: z.number(),
      district_id: z.number(),
      sub_district_id: z.number(),
      zip_code: z.string().nullable(),
      verify_date: z
        .string()
        .optional()
        .nullable()
        .transform((v) => (v ? dayjs(v) : null))
        .refine((v) => (v ? v.isValid() : true), "invalid date format"),
    })
    .optional(),
  accessToken: z.string(),
  refreshToken: z.string(),
  accessTokenExpiresIn: z.number(),
  refreshTokenExpiresIn: z.number(),
});
