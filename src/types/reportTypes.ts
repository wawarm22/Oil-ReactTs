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
