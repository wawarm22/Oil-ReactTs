import React from "react";
import { OcrOilProductDocument } from "../../types/ocrFileType";

interface ChecklistOilProductProps {
    data: OcrOilProductDocument;
}

type Ingredient = {
    type: string;
    size: string;
    volume: string;
};

const ChecklistOilProduct: React.FC<ChecklistOilProductProps> = ({ data }) => {
    const parseIngredients = (): {
        order: string;
        productName: string;
        productSize: string;
        ingredients: Ingredient[];
    }[] => {
        const result: ReturnType<typeof parseIngredients> = [];

        const rows = data.detail_table.slice(2);

        for (const row of rows) {
            const props = row.properties ?? {};
            const order = props.column_1?.value ?? "-";
            const productName = props.column_2?.value ?? "-";
            const productSize = props.column_3?.value ?? "-";

            const typeList = (props.column_5?.value ?? "-").split("\n");
            const sizeList = (props.column_6?.value ?? "-").split("\n");
            const volumeList = (props.column_7?.value ?? "-").split("\n");

            const maxLen = Math.max(typeList.length, sizeList.length, volumeList.length);

            const ingredients: Ingredient[] = Array.from({ length: maxLen }).map((_, idx) => ({
                type: typeList[idx] ?? "-",
                size: sizeList[idx] ?? "-",
                volume: volumeList[idx] ?? "-",
            }));

            result.push({ order, productName, productSize, ingredients });
        }

        return result;
    };

    const parsedData = parseIngredients();

    if (parsedData.length === 0) {
        return <p className="text-muted">ไม่พบข้อมูลสินค้า</p>;
    }

    return (
        <div className="d-flex flex-column gap-4">
            {parsedData.map((item, index) => (
                <div key={index} className="d-flex flex-column gap-2">
                    <div className="fw-bold">ลำดับที่</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2">{item.order}</div>

                    <div className="fw-bold">ประเภทสินค้า/ชื่อสินค้าที่ผลิต</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2">{item.productName}</div>

                    <div className="fw-bold">แบบหรือขนาด</div>
                    <div className="border rounded-2 shadow-sm bg-white p-2">{item.productSize || "-"}</div>

                    {item.ingredients.map((ing, i) => (
                        <div key={i} className="d-flex flex-column gap-2">
                            <div className="fw-bold">
                                รายการวัตถุดิบหรือส่วนประกอบที่นำมาใช้ในการผลิตสินค้า (ต่อสินค้า 1 หน่วย) (100 ลิตร)
                            </div>
                            <div className="fw-bold">ประเภท</div>
                            <div className="border rounded-2 shadow-sm bg-white p-2">{ing.type}</div>

                            <div className="fw-bold">แบบหรือขนาด</div>
                            <div className="border rounded-2 shadow-sm bg-white p-2">{ing.size}</div>

                            <div className="fw-bold">ปริมาณหรือจำนวน</div>
                            <div className="border rounded-2 shadow-sm bg-white p-2 mb-2">{ing.volume}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ChecklistOilProduct;
