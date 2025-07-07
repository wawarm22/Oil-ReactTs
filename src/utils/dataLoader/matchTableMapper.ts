import { OilReceiveItem } from "../../types/oilReceiveTypes";
import { OilUseInProductItem, ProductFormula, RawMaterialPaymentItem } from "../../types/reportTypes";
import { TableData } from "../../types/tableTypes";
import { VolumeCompareData } from "../../types/volumeTableTypes";
import { formatDate, readableNumber } from "../function/format";

export const mapAllProductFormulas = (formulas: ProductFormula[]): TableData[] => {
  return formulas.map((formula) => ({
    productName: formula.name,
    items: formula.materials.map((mat) => ({
      type: "",
      name: mat.name,
      quantity: Number(mat.quantity),
      ratio: mat.ratio,
      productionFormula: `${Number(mat.min_quantity).toFixed(6)} - ${Number(mat.max_quantity).toFixed(6)}`, approvalNumber: `${formula.type_label} ${formula.type_index_label}`,
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
      let totalVolume = 0
      materialNames.forEach(name => {
        const found = item.materials.find(mat => mat.name === name);
        mats[name] = found ? found.used : 0;
        totalVolume += found ? found.used : 0;
      });
      return {
        date: formatDate(item.date),
        materials: mats,
        totalVolume: totalVolume,
        productionVolume: item.total_used,
        taxVolume: item.total_cost,
        compareWithProduction: readableNumber(totalVolume - item.total_used, 0),
        compareWithTax: readableNumber(totalVolume - item.total_cost, 0),
      };
    }),
    materialNames
  };
};

export const mapOilUseInProductsToOilReceive = (
  items: OilUseInProductItem[]
): OilReceiveItem[] => {
  return items.map(item => {
    let receiveDate = "";
    let sellDate = "";

    if (item.is_reciept_from_other_month || item.is_reciept) {
      receiveDate = item.date;
    }
    if (item.is_consume) {
      sellDate = item.date;
    }

    return {
      receiveDate,
      receiveDocNo: item.reciept_invoice || "",
      taxDocNo: item.transfer_invoice || "",
      jvNo: "",
      vendorCode: "",
      vendorName: item.reciept_from_factory?.slug || "",
      vendorFullName: item.reciept_from_factory?.name || "",
      quantityBeforeTax: item.reciept_quantity ?? 0,
      quantityActual: 0,
      taxRate: "",
      sellDate,
      sellDomTaxDocNo: item.consume_invoice || "",
      sellDomTaxQty: item.consume_quantity ?? 0,
      transferToFactory: item.transfer_to_factory || "",
      transferTaxNo: item.transfer_invoice || "",
      transferTaxQty: item.transfer_quantity ?? 0,
      remark: "",
    };
  });
};


