import React from "react";
import { OcrRefineryTaxInvoiceDocument } from "../../types/ocrFileType";
import { OcrTaxInvoiceData, TaxInvoiceItem } from "../../types/validateTypes";
import { ValidateTaxInvoiceResult } from "../../types/validateResTypes";
import { useCompanyStore } from "../../store/companyStore";
import { shellTaxInvoiceFields } from "../../utils/function/shellTaxInvoiceConfig";

interface Props {
    data: OcrRefineryTaxInvoiceDocument;
    validateResult: ValidateTaxInvoiceResult | null;
    context: OcrTaxInvoiceData | null
}

const ChecklistRefineryTaxInvoice: React.FC<Props> = ({ validateResult, context }) => {
    const ocrData = context;
    const { selectedCompany } = useCompanyStore();
    
    const cleanValue = (val?: string | number | null): string => {
        if (val === null || val === undefined) return "";
        if (typeof val === "number") return val.toLocaleString();
        if (typeof val === "string" && (val.trim() === "" || val === ":unselected:")) return "";
        return String(val).trim();
    };

    const getValidatedField = (key: keyof ValidateTaxInvoiceResult, fallback: string | number = "") => {
        const val = validateResult?.[key];
        if (val && typeof val === "object" && "value" in val) {
            return { value: cleanValue(val.value), border: val.passed ? "#22C659" : "#FF0100" };
        }
        return { value: cleanValue(fallback), border: "#22C659" };
    };

    const totalKeyMap: Record<string, keyof ValidateTaxInvoiceResult> = {
        "รวมมูลค่าสินค้าหรือบริการ Amount": "subTotal",
        "ภาษีมูลค่าเพิ่ม VAT 7%": "vat7",
        "จำนวนเงินรวมทั้งสิ้น Total Amout": "totalAmount",
        "ตัวอักษร In Words": "inWords",
        "อ้างอิงภายใน Internal Refere": "internalRef",
        "ผู้รับสินค้า Received By": "receiptBy",
        "วันที่ / Date": "receivedDate"
    };
   
    if (!ocrData) {
        return <div>ไม่พบข้อมูล</div>;
    }

    const f = ocrData.fields;

    const fields = [
        { label: "สำนักงานใหญ่", key: "invoiceBranch", value: f.invoiceBranch },
        { label: "ชื่อและที่อยู่ลูกค้า Customer Name and Address", key: "customerInfo", value: cleanValue(f.customerInfo) },
        { label: "เลขที่ประจำตัวผู้เสียภาษีอากร TAX ID", key: "taxId", value: f.taxId },
        { label: "สถานที่จัดส่ง Ship to", key: "shipTo", value: f.shipTo },
        { label: "เลขที่เอกสาร Document No.", key: "documentNo", value: f.documentNo },
        { label: "วันที่ Date", key: "date", value: f.date },
        { label: "เงื่อนไขในการชำระเงิน Payment", key: "paymentTerm", value: f.paymentTerm },
        { label: "วันครบกำหนดชำระ Due Date", key: "dueDate", value: f.dueDate },
        { label: "เลขที่เอกสารการสั่งซื้อ PO No.", key: "poNo", value: f.poNo },
        { label: "เงื่อนไขการขนส่ง Inco.Term", key: "incoTerm", value: f.incoTerm },
    ];

    const columnLabelMap: Record<keyof TaxInvoiceItem, string> = {
        itemNo: "ลำดับ",
        description: "รายการ",
        quantity: "จำนวน",
        unit: "หน่วย",
        unitPrice: "ราคาต่อหน่วย",
        amount: "จำนวนเงิน",
        note: "หมายเหตุ"
    };

    const total = [
        { label: "รวมมูลค่าสินค้าหรือบริการ Amount", value: f.subTotal },
        { label: "ภาษีมูลค่าเพิ่ม VAT 7%", value: f.vat7 },
        { label: "จำนวนเงินรวมทั้งสิ้น Total Amout", value: f.totalAmount },
        { label: "ตัวอักษร In Words", value: f.inWords },
        { label: "อ้างอิงภายใน Internal Refere", value: f.internalRef },
        { label: "ผู้รับสินค้า Received By", value: f.receiptBy },
        { label: "วันที่ / Date", value: f.receivedDate },
    ];

    const isShell = selectedCompany?.name === "SHELL";

    return (
        <div className="d-flex flex-column gap-3">
            {(isShell ? shellTaxInvoiceFields : fields).map(({ label, key }) => {
                let value: any = "";
                if (Array.isArray(key)) {
                    value = key
                        .map(k => {
                            const val = f[k as keyof typeof f];
                            if (typeof val === "string" || typeof val === "number" || val == null) {
                                return cleanValue(val);
                            }
                            return "";
                        })
                        .filter(Boolean)
                        .join(" ");
                } else {
                    const val = f[key as keyof typeof f];
                    value = (typeof val === "string" || typeof val === "number" || val == null)
                        ? cleanValue(val)
                        : "";
                }

                const v = isShell
                    ? value
                    : getValidatedField(key as keyof ValidateTaxInvoiceResult, value).value;

                const border = isShell
                    ? "#22C659"
                    : getValidatedField(key as keyof ValidateTaxInvoiceResult, value).border;

                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div
                            className="rounded-2 shadow-sm bg-white p-2"
                            style={{ fontSize: "14px", minHeight: "42px", border: `1.5px solid ${border}` }}
                        >
                            {v}
                        </div>
                    </div>
                );
            })}

            {/* รายการสินค้า */}
            {Array.isArray(f.items) && f.items.length > 0 && (
                <>
                    <hr className="border-top border-2 border-secondary m-0 mt-1" />
                    {f.items.map((item, rowIndex) => (
                        <div key={`row-${rowIndex}`}>
                            {Object.entries(columnLabelMap).map(([key, label]) => {
                                const vd = Array.isArray(validateResult?.items) ? validateResult.items[rowIndex] : undefined;
                                const valObj = vd && (vd as any)[key];
                                const v = valObj && typeof valObj === "object" && "value" in valObj
                                    ? cleanValue(valObj.value)
                                    : cleanValue((item as any)[key]);
                                const border = valObj && typeof valObj === "object" && "passed" in valObj
                                    ? (valObj.passed ? "#22C659" : "#FF0100")
                                    : "#22C659";
                                return (
                                    <div key={`${rowIndex}-${key}`}>
                                        <div className="fw-bold">{label}</div>
                                        <div className="rounded-2 shadow-sm bg-white p-2"
                                            style={{ fontSize: "14px", minHeight: "42px", border: `1.5px solid ${border}` }}>
                                            {v}
                                        </div>
                                    </div>
                                );
                            })}
                            <hr className="border-top border-1 border-secondary m-0 mt-2" />
                        </div>
                    ))}
                </>
            )}

            {/* สรุปท้าย */}
            {total.map(({ label, value }) => {
                const k = totalKeyMap[label];
                const { value: v, border } = getValidatedField(k, value);
                return (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="rounded-2 shadow-sm bg-white p-2"
                            style={{ fontSize: "14px", minHeight: "42px", border: `1.5px solid ${border}` }}>
                            {v}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ChecklistRefineryTaxInvoice;
