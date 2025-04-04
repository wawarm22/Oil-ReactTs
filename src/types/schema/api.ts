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
