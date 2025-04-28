import React from "react";
import { OcrGroupedProductDocument } from "../../types/ocrFileType";

interface ChecklistGroupedProductProps {
    data: OcrGroupedProductDocument;
}

const ChecklistGroupedProduct: React.FC<ChecklistGroupedProductProps> = ({ data }) => {
    const groupProducts = () => {
        const groups: {
            productName: string;
            ingredients: { material: string; volume: string }[];
        }[] = [];

        let currentProductNames: string[] = [];
        let currentIngredients: { material: string; volume: string }[] = [];

        for (const row of data.detail_table) {
            const props = row?.properties ?? {};
            const material = props.material_per_liter?.value?.trim();
            const product = props.product_name?.value?.trim();
            const volume = props.value_liter?.value?.trim();

            if (!material) continue;

            if (volume) currentIngredients.push({ material, volume });
            if (product) currentProductNames.push(product);

            if (material === "รวม") {
                groups.push({
                    productName: currentProductNames.join(" "),
                    ingredients: [...currentIngredients],
                });
                currentProductNames = [];
                currentIngredients = [];
            }
        }

        // กันกรณีไม่มี "รวม" ปิดท้าย
        if (currentProductNames.length || currentIngredients.length) {
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
                    {/* Product Name */}
                    <div className="fw-bold">ชื่อผลิตภัณฑ์</div>
                    <div
                        className="border rounded-2 shadow-sm bg-white"
                        style={{ fontSize: "14px", whiteSpace: "pre-line", padding: "10px" }}
                    >
                        {group.productName || "-"}
                    </div>

                    {/* Ingredients - separate labels */}
                    {group.ingredients.map((item, i) => (
                        <div key={i} className="d-flex flex-column gap-2">
                            {/* Material */}
                            <div className="fw-bold">รายการวัตถุดิบหรือส่วนประกอบที่นำมาใช้ในการผลิตสินค้า (ต่อสินค้า ๑ หน่วย)</div>
                            <div
                                className="border rounded-2 shadow-sm bg-white"
                                style={{ fontSize: "14px", whiteSpace: "pre-line", padding: "10px" }}
                            >
                                {item.material}
                            </div>

                            {/* Volume */}
                            <div className="fw-bold">ปริมาณหรือจำนวน (ลิตร)</div>
                            <div
                                className="border rounded-2 shadow-sm bg-white mb-3"
                                style={{ fontSize: "14px", whiteSpace: "pre-line", padding: "10px" }}
                            >
                                {item.volume}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ChecklistGroupedProduct;
