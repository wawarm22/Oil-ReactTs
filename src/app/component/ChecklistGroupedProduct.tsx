import React, { useEffect, useState } from "react";
import { OcrGroupedProductDocument } from "../../types/ocrFileType";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { AuthSchema } from "../../types/schema/auth";
import { getPreparedFormularApprov } from "../../utils/api/validateApi";
import { PreparedFormularApprovResponse } from "../../types/preparedTypes";

interface ChecklistGroupedProductProps {
    data: OcrGroupedProductDocument;
}

const ChecklistGroupedProduct: React.FC<ChecklistGroupedProductProps> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const [_ocrData, setOcrData] = useState<PreparedFormularApprovResponse | null>(null);
    const [_loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth || !data.id) return;

        setLoading(true);
        getPreparedFormularApprov(data.id, auth)
            .then(res => {
                setOcrData(res.data);
            })
            .catch(() => {
                setOcrData(null);
            })
            .finally(() => setLoading(false));
    }, [data.id, auth]);

    const groupProducts = () => {
        const groups: {
            productName: string;
            ingredients: { label: string; value?: string }[];
        }[] = [];

        let currentProductNames: string[] = [];
        let currentIngredients: { label: string; value?: string }[] = [];
        let stopGrouping = false;

        // const materials = ocrData?.fields?.materials;
        // const productName = ocrData?.fields?.product || "";

        for (let idx = 0; idx < data.detail_table.length; idx++) {
            const row = data.detail_table[idx];
            const props = row?.properties ?? {};

            const no = props.no?.value?.trim().replace(/\n/g, " ");
            const productType = props.product_type?.value?.trim().replace(/\n/g, " ");
            const productName = props.product_name?.value?.trim().replace(/\n/g, " ");
            const unit = props.unit?.value?.trim().replace(/\n/g, " ");

            // const materialType = materials && materials[idx] ? materials[idx].name : undefined;
            // const materialValue = materials && materials[idx] ? materials[idx].quantity : undefined;

            const materialType = props.material_type?.value?.trim().replace(/\n/g, " ");
            const materialUnit = props.material_unit?.value?.trim().replace(/\n/g, " ");
            const materialValue = props.material_value?.value?.trim().replace(/\n/g, " ");

            if (materialType && materialType.includes("รวม")) {
                currentIngredients.push({
                    label: "รวม",
                    value: materialValue || ""
                });

                groups.push({
                    productName: currentProductNames.join(" "),
                    ingredients: [...currentIngredients],
                });
                stopGrouping = true;
                break;
            }

            if (productName) currentProductNames.push(productName);

            if (no) currentIngredients.push({ label: "ลำดับ", value: no });
            if (productType) currentIngredients.push({ label: "ประเภทสินค้า", value: productType });
            if (productName) currentIngredients.push({ label: "ชื่อสินค้าที่ผลิต", value: productName });
            if (unit) currentIngredients.push({ label: "แบบหรือขนาด", value: unit });

            if (materialType) {
                currentIngredients.push({ label: "รายการวัตถุดิบหรือส่วนประกอบที่นำมาใช้ในการผลิตสินค้า (ต่อสินค้า 1 หน่วย)" });
            }

            if (materialType) currentIngredients.push({ label: "ประเภท", value: materialType });
            if (materialUnit) currentIngredients.push({ label: "แบบหรือขนาด", value: materialUnit });
            if (materialValue) currentIngredients.push({ label: "ปริมาณหรือจำนวน", value: materialValue });
        }

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

                    {group.ingredients.map((item, i) => (
                        <div key={i} className="d-flex flex-column gap-2">
                            <div className="fw-bold">{item.label}</div>
                            {item.value && (
                                <div
                                    className="border rounded-2 shadow-sm bg-white"
                                    style={{ fontSize: "14px", whiteSpace: "pre-line", padding: "10px" }}
                                >
                                    {item.value || ""}
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
