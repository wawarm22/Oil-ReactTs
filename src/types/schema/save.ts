import { z } from "zod";

export const createSaveSchema = <T extends object>(
  dataSchema: z.ZodType<T>
) => {
  return z.object({
    month: z.string(),
    from_date: z.string(),
    to_date: z.string(),
    periot: z.string(),
    factory_slug: z.string(),
    company_id: z.number(),
    data: z.object({
      docType: z.string(),
      documentGroup: z.string(),
      transport: z.enum(["00", "01"]).optional(),
      fields: dataSchema,
    }),
  });
};

export type Form0503Page1 = {
  form_name: string;
  ref_no: string;
  request_no: string;
  request_date: string;
  request_officer: string;
  company_name: string;
  factory_name: string;
  excise_no: string;
  address_no: string;
  village_no: string;
  soi: string;
  street: string;
  sub_district: string;
  district: string;
  province: string;
  zipcode: string;
  tel_no: string;
  form_0503a_ref: string;
  form_0503b_ref: string;
  products: Form0503Page1Product[];
  total_tax: number;
};

export type Form0503Page1Product = {
  index: number;
  product_name: string;
  product_id: number;
  receipt_no: string;
  receipt_date: string;
  quantity: number;
  tax_by_value_baht: number;
  tax_by_value_satang: number;
  tax_by_volumn_baht: number;
  tax_by_volumn_satang: number;
  discount_baht: number;
  discount_satang: number;
};

export type Save0503Schema = z.infer<typeof Save0503Schema>;
export const Save0503Schema = createSaveSchema<Form0503Page1>(
  z.object({
    form_name: z.string(),
    ref_no: z.string(),
    request_no: z.string(),
    request_date: z.string(),
    request_officer: z.string(),
    company_name: z.string(),
    factory_name: z.string(),
    excise_no: z.string(),
    address_no: z.string(),
    village_no: z.string(),
    soi: z.string(),
    street: z.string(),
    sub_district: z.string(),
    district: z.string(),
    province: z.string(),
    zipcode: z.string(),
    tel_no: z.string(),
    form_0503a_ref: z.string(),
    form_0503b_ref: z.string(),
    products: z.array(
      z.object({
        index: z.number(),
        product_name: z.string(),
        product_id: z.number(),
        receipt_no: z.string(),
        receipt_date: z.string(),
        quantity: z.number(),
        tax_by_value_baht: z.number(),
        tax_by_value_satang: z.number(),
        tax_by_volumn_baht: z.number(),
        tax_by_volumn_satang: z.number(),
        discount_baht: z.number(),
        discount_satang: z.number(),
      })
    ),
    total_tax: z.number(),
  })
);

// let a = {} as any
// let b = Save0503Schema.safeParse(a)
// b.success