export type ProductMaterial = {
    id: number;
    name: string;
    quantity: number;
    min_quantity: number;
    max_quantity: number;
    ratio: number;
}

export type ProductFormula = {
    id: number;
    name: string;
    type_index_label: string;
    type_label: string;
    remark: string;
    materials: ProductMaterial[];
}

export type ProductFormulaResponse = {
    status: boolean;
    message: string;
    data: ProductFormula[];
}

export type RawMaterialPaymentMaterial = {
  name: string;
  gained: number;
  used: number;
}

export type RawMaterialPaymentItem = {
  date: string;
  materials: RawMaterialPaymentMaterial[];
  total_gained: number;
  total_used: number;
  total_cost: number;
  total_remains: number;
  total_diff: number;
}

export type RawMaterialPaymentsResponse = {
  status: boolean;
  message: string;
  data: RawMaterialPaymentItem[];
}

export type FactoryInfo = {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    company_id: number;
    excise_id: string;
    name: string;
    name_th: string | null;
    name_en: string | null;
    slug: string;
}

export type OilUseInProductItem = {
    id: number;
    ocr_form_receitp_payment_master_id: number;
    date: string;
    is_reciept_from_other_month: boolean;
    is_reciept: boolean;
    is_consume: boolean;
    reciept_from_factory_label: string | null;
    reciept_from_factory_id: number | null;
    reciept_invoice: string | null;
    reciept_quantity: number | null;
    consume_quantity: number | null;
    consume_invoice: string | null;
    transfer_to_factory_label: string | null;
    transfer_to_factory_id: number | null;
    transfer_invoice: string | null;
    transfer_quantity: number | null;
    total_invoice_quantity: number | null;
    total_quantity: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    transfer_to_factory: any | null;
    reciept_from_factory: FactoryInfo | null;
}

export type OilUseInProductsResponse = {
    status: boolean;
    message: string;
    data: OilUseInProductItem[];
}
