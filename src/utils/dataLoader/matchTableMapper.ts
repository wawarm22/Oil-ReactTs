import { ProductFormula, RawMaterialPaymentItem } from "../../types/reportTypes";
import { TableData } from "../../types/tableTypes";
import { VolumeCompareData } from "../../types/volumeTableTypes";
import { formatDate } from "../function/format";

export const mapAllProductFormulas = (formulas: ProductFormula[]): TableData[] => {
  return formulas.map((formula) => ({
    productName: formula.name,
    items: formula.materials.map((mat) => ({
      type: "",
      name: mat.name,
      quantity: mat.quantity,
      ratio: mat.ratio,
      productionFormula: `${Number(mat.min_quantity).toFixed(6)} - ${Number(mat.max_quantity).toFixed(6)}`,      approvalNumber: `${formula.type_label} ${formula.type_index_label}`,
      remark: formula.remark
    }))
  }));
};

export const mapRawMaterialPayments = (
  rawData: RawMaterialPaymentItem[]
): VolumeCompareData => {
  const materialNames = Array.from(
    new Set(rawData.flatMap(item => item.materials.map(mat => mat.name)))
  );

  return {
    headers: [
      "วันที่",
      ...materialNames,
      "ปริมาณรวม (ลิตร)",
      "ปริมาณการผลิตและจำหน่าย",
      "ปริมาณการชำระภาษี",
      "ผลต่าง (ยอดรวม-ยอดใช้จริง)"
    ],
    items: rawData.map(item => {
      const mats: { [name: string]: number } = {};
      materialNames.forEach(name => {
        const found = item.materials.find(mat => mat.name === name);
        mats[name] = found ? found.gained : 0;
      });
      return {
        date: formatDate(item.date),
        materials: mats,
        totalVolume: item.total_gained,
        productionVolume: item.total_used,
        taxVolume: item.total_cost,
        compareWithProduction: item.total_remains.toLocaleString(),
        compareWithTax: item.total_diff.toLocaleString(),
      };
    }),
    materialNames
  };
};

