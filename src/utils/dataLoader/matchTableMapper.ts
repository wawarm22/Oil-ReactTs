import { OilReceiveItem } from "../../types/oilReceiveTypes";
import { MaterialUsageData, ProductionData } from "../../types/productionTypes";
import { MaterialProductDistributionData, OcrForm0704Material, OcrForm0704Product, OilUseInProductItem, ProductFormula, RawMaterialPaymentItem } from "../../types/reportTypes";
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
      quantityBeforeTax: item.reciept_quantity ?? item.bl ?? "",
      quantityActual: item.outturn || 0,
      taxRate: item.tax_rate || 0,
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

export const mapMaterialUsageTable = (
  data: MaterialProductDistributionData | null
): MaterialUsageData => {
  if (!data || !data.ocr_form_07_04_master?.[0]?.ocr_form_07_04_materials) {
    return {
      headers: [
        "รายการ",
        "ไม่มีข้อมูล",
      ],
      items: [],
    };
  }

  const mats = data.ocr_form_07_04_master[0].ocr_form_07_04_materials;

  const rows = [
    { label: "คงเหลือยกมา", field: "open" },
    { label: "รับเดือนนี้", field: "getted" },
    { label: "รวม", field: "total" },
    { label: "ผลิตลินค้าตามพิกัด ฯ", field: "produce" },
    { label: "ผลิตสินค้าอื่น", field: "produce_other" },
    { label: "ส่วนขาด/ส่วนเกิน", field: "defected" },
    { label: "อื่น ๆ (จ่ายโอนคลัง)", field: "etc" },
    { label: "Loss/Gain", field: "loss_gain" },
    { label: "คงเหลือยกไป", field: "forward" },
  ];

  const headers = ["รายการ", ...mats.map((mat) => mat.material_name)];

  const items = rows.map((row) => ({
    item: row.label,
    values: mats.map((mat) => (mat[row.field as keyof OcrForm0704Material] as number) ?? 0),
  }));

  return { headers, items };
};

export const mapProductionTable = (
  data: MaterialProductDistributionData | null
): ProductionData => {
  if (!data || !data.ocr_form_07_04_master?.[0]?.ocr_form_07_04_products) {
    return {
      headers: [
        "รายการ",
        "ไม่มีข้อมูล",
      ],
      items: [],
    };
  }

  const prods = data.ocr_form_07_04_master[0].ocr_form_07_04_products;

  const rows = [
    { label: "คงเหลือยกมา", field: "open" },
    { label: "รับจากการผลิต", field: "produced" },
    { label: "รับคืนคืนจากคลังสินค้าทัณฑ์บน", field: "bonded_return" },
    { label: "อื่น ๆ", field: "etc_getted" },
    { label: "รวม", field: "total" },
    { label: "จำหน่ายในประเทศ", field: "domestic_sales" },
    { label: "จำหน่ายต่างประเทศ", field: "overseas_sales" },
    { label: "ใช้ในโรงอุตสาหกรรม", field: "used_in_industrial_plants" },
    { label: "คลังลินค้าทัณฑ์บน", field: "bonded" }, // **field ที่ถูกต้องใน Product ควรใช้ bonded ไม่ใช่ bonded_return**
    { label: "เสียหาย", field: "defected" },
    { label: "คงเหลือยกไป", field: "forward" },
    { label: "อื่น ๆ", field: "etc_used" },
  ];

  const headers = ["รายการ", ...prods.map((prod) => prod.product_name)];
  const items = rows.map((row) => ({
    item: row.label,
    values: prods.map((prod) => (prod[row.field as keyof OcrForm0704Product] as number) ?? 0),
  }));

  return { headers, items };
};


