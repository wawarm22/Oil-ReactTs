import { z } from "zod";
export type FactorySchema = z.infer<typeof FactorySchema>
export const FactorySchema = z.array(z.object({

    "user_id": z.number(),
    "factory_id": z.number(),
    "factory": z.object({
        "id": z.number(),
        "company_id": z.number(),
        "excise_id": z.string(),
        "name": z.string(),
        "slug": z.string()
    })

}))