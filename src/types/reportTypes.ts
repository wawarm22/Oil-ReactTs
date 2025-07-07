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

export type MaterialProductDistributionResponse = {
  status: boolean;
  message: string;
  data: MaterialProductDistributionData;
};

export type MaterialProductDistributionData = {
  id: number;
  user_id: number;
  month: string;
  from_date: string;
  to_date: string;
  periot: string;
  factory_id: number;
  company_id: number;
  document_prefix: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  ocr_form_07_04_master: OcrForm0704Master[];
};

export type OcrForm0704Master = {
  id: number;
  ocr_master_id: number;
  form_type: string;
  request_number: string;
  received_at: string;
  form_officer_name: string;
  company_name: string;
  excise_id: string;
  period: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  ocr_form_07_04_materials: OcrForm0704Material[];
  ocr_form_07_04_products: OcrForm0704Product[];
};

export type OcrForm0704Material = {
  id: number;
  ocr_form_07_04_master_id: number;
  material_id: number;
  material_name: string;
  open: number;
  getted: number;
  total: number;
  produce: number;
  produce_other: number;
  defected: number;
  etc: number;
  loss_gain: number;
  calculated_balance: number;
  forward: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  material: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
};

export type OcrForm0704Product = {
  id: number;
  ocr_form_07_04_master_id: number;
  product_id: number;
  product_name: string;
  open: number;
  produced: number;
  bonded_return: number;
  etc_getted: number;
  total: number;
  domestic_sales: number;
  overseas_sales: number;
  used_in_industrial_plants: number;
  bonded: number;
  defected: number;
  forward: number;
  etc_used: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  product: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    company_id: number;
    factory_id: number;
    remark: string;
    type_index_label: string;
    type_label: string;
  };
};
