import { z } from "zod";
import { AuthSchema } from "./auth";

const ApiResponse = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.boolean(),
    message: z.string(),
    data: dataSchema,
  });

export type ApiLoginResponseSchema = z.infer<typeof ApiLoginResponseSchema>;
export const ApiLoginResponseSchema = ApiResponse(AuthSchema);

export type ApiMyFactorySchema = z.infer<typeof ApiMyFactorySchema>;
export const ApiMyFactorySchema = ApiResponse(
  z.array(
    z.object({
      user_id: z.number(),
      factory_id: z.number(),
      factory: z.object({
        id: z.number(),
        company_id: z.number(),
        excise_id: z.string(),
        name: z.string(),
        slug: z.string(),
      }),
    })
  )
);
