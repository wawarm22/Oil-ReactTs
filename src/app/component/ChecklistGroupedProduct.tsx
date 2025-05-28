import React from "react";
import { OcrGroupedProductDocument } from "../../types/ocrFileType";

interface ChecklistGroupedProductProps {
    data: OcrGroupedProductDocument;
}

const ChecklistGroupedProduct: React.FC<ChecklistGroupedProductProps> = ({ data }) => {
    const groupProducts = () => {
        const groups: {
            productName: string;
            ingredients: { label: string; value?: string }[]; // Changed to hold label-value pairs
        }[] = [];

        let currentProductNames: string[] = [];
        let currentIngredients: { label: string; value?: string }[] = [];
        let stopGrouping = false; // Flag to stop grouping when "รวม" is found

        for (const row of data.detail_table) {
            const props = row?.properties ?? {};

            const no = props.no?.value?.trim().replace(/\n/g, " ");
            const productType = props.product_type?.value?.trim().replace(/\n/g, " ");
            const productName = props.product_name?.value?.trim().replace(/\n/g, " ");
            const unit = props.unit?.value?.trim().replace(/\n/g, " ");
            const materialType = props.material_type?.value?.trim().replace(/\n/g, " ");
            const materialUnit = props.material_unit?.value?.trim().replace(/\n/g, " ");
            const materialValue = props.material_value?.value?.trim().replace(/\n/g, " ");

            // Check for "รวม" in material_type and stop the grouping if found
            if (materialType && materialType.includes("รวม")) {
                currentIngredients.push({
                    label: "รวม",
                    value: materialValue || "-"
                });

                // Add the current group and reset
                groups.push({
                    productName: currentProductNames.join(" "),
                    ingredients: [...currentIngredients],
                });
                stopGrouping = true; // Stop grouping further
                break; // Exit the loop when "รวม" is found
            }

            // Add information to the current group
            if (productName) currentProductNames.push(productName);

            if (no) currentIngredients.push({ label: "ลำดับ", value: no });
            if (productType) currentIngredients.push({ label: "ประเภทสินค้า", value: productType });
            if (productName) currentIngredients.push({ label: "ชื่อสินค้าที่ผลิต", value: productName });
            if (unit) currentIngredients.push({ label: "แบบหรือขนาด", value: unit });

            // แทรก label สำหรับ "รายการวัตถุดิบหรือส่วนประกอบที่นำมาใช้ในการผลิตสินค้า (ต่อสินค้า 1 หน่วย)" และไม่แสดง value
            if (materialType) {
                currentIngredients.push({ label: "รายการวัตถุดิบหรือส่วนประกอบที่นำมาใช้ในการผลิตสินค้า (ต่อสินค้า 1 หน่วย)" });
            }

            if (materialType) currentIngredients.push({ label: "ประเภท", value: materialType });
            if (materialUnit) currentIngredients.push({ label: "แบบหรือขนาด", value: materialUnit });
            if (materialValue) currentIngredients.push({ label: "ปริมาณหรือจำนวน", value: materialValue });
        }

        // Add the last group if no "รวม" was found
        if (!stopGrouping && (currentProductNames.length || currentIngredients.length)) {
            groups.push({
                productName: currentProductNames.join(" "),
                ingredients: [...currentIngredients],
            });
        }

        return groups;
    };

    const grouped = groupProducts();

    if (grouped.length === 0) {
        return <p className="text-muted">ไม่พบข้อมูลวัตถุดิบ</p>;
    }

    return (
        <div className="d-flex flex-column gap-4">
            {grouped.map((group, index) => (
                <div key={index} className="d-flex flex-column gap-2">                    

                    {/* Ingredients - separate labels */}
                    {group.ingredients.map((item, i) => (
                        <div key={i} className="d-flex flex-column gap-2">
                            {/* Material */}
                            <div className="fw-bold">{item.label}</div>
                            {/* Only show value if it's not empty */}
                            {item.value && (
                                <div
                                    className="border rounded-2 shadow-sm bg-white"
                                    style={{ fontSize: "14px", whiteSpace: "pre-line", padding: "10px" }}
                                >
                                    {item.value || "-"}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ChecklistGroupedProduct;
