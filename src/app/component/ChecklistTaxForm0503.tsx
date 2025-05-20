import React, { useEffect, useState } from "react";
import { OcrTaxForm0503Document } from "../../types/ocrFileType";
import { AuthSchema } from "../../types/schema/auth";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { getPrepared0503 } from "../../utils/api/validateApi";

interface Props {
    data: OcrTaxForm0503Document;
}

const ChecklistTaxForm0503: React.FC<Props> = ({ data }) => {
    const auth = useAuthUser<AuthSchema>();
    const [ocrData, setOcrData] = useState<OcrTaxForm0503Document | null>(null);

    const cleanValue = (val?: string | null): string => {
        if (!val || val.trim() === "" || val === ":unselected:") return "-";
        return val.trim();
    };

    useEffect(() => {
        console.log("auth",auth);
        console.log("id", data.id);        
        
        if (!auth || !auth.accessToken) {
            return;
        }

        if (!data.id) {
            return;
        }

        getPrepared0503(data.id, auth)
            .then((res) => {
                console.log("Data from getPrepared0503:", res);
                if (res) {
                    setOcrData(res);
                } else {
                    console.log("Failed to fetch OCR data.");
                }
            })
            .catch((e) => {
                console.log("Error fetching OCR data.");
            })
    }, [data.id, auth]);


    const fields = [
        { label: "ชื่อผู้ประกอบอุตสาหกรรม", value: cleanValue(data.excise_name) },
        { label: "ชื่อโรงอุตสาหกรรม", value: cleanValue(data.company_name) },
        { label: "ทะเบียนสรรพสามิตเลขที่", value: cleanValue(data.excise_no) },
        { label: "สถานที่ตั้งเลขที่", value: cleanValue(data.address_no) },
        { label: "ตรอก/ซอย", value: cleanValue(data.soi) },
        { label: "ถนน", value: cleanValue(data.road) },
        { label: "ตำบล/แขวง", value: cleanValue(data.sub_district) },
        { label: "อำเภอ/เขต", value: cleanValue(data.district) },
        { label: "จังหวัด", value: cleanValue(data.province) },
        { label: "รหัสไปรษณีย์", value: cleanValue(data.postcode) },
        { label: "โทรศัพท์", value: cleanValue(data.phone_number) },
    ];

    return (
        <div className="d-flex flex-column gap-2">
            {fields.map(({ label, value }) =>
                value ? (
                    <div key={label}>
                        <div className="fw-bold">{label}</div>
                        <div className="border rounded-2 shadow-sm bg-white p-2 mb-2" style={{ fontSize: "14px" }}>
                            {value}
                        </div>
                    </div>
                ) : null
            )}

            {data.detail_table.length > 3 && (
                <>
                    {data.detail_table.slice(3).map((entry, index) => {
                        const props = entry.properties || {};
                        const detailFields = [
                            { label: "ลำดับที่", value: cleanValue(props.column_1?.value) },
                            { label: "รายการวัตถุดิบส่วนประกอบในการผลิคสินค้า", value: cleanValue(props.column_2?.value) },
                            { label: "ใบเสร็จรับเงินค่าภาษีสรรพสามิต - เลขที่", value: cleanValue(props.column_3?.value) },
                            { label: "ใบเสร็จรับเงินค่าภาษีสรรพสามิต - วันเดือนปี", value: cleanValue(props.column_4?.value) },
                            { label: "ปริมาณที่ใช้ผลิต", value: cleanValue(props.column_5?.value) },
                            { label: "อัตราภาษีตามมูลค่า (บาท)", value: cleanValue(props.column_6?.value) },
                            { label: "อัตราภาษีตามมูลค่า (สต.)", value: cleanValue(props.column_7?.value) },
                            { label: "อัตราภาษีตามปริมาณ (บาท)", value: cleanValue(props.column_8?.value) },
                            { label: "อัตราภาษีตามปริมาณ (สต.)", value: cleanValue(props.column_9?.value) },
                            { label: "จำนวนเงินภาษีสรรพสามิตที่ขอลดหย่อน (บาท)", value: cleanValue(props.column_10?.value) },
                            { label: "จำนวนเงินภาษีสรรพสามิตที่ขอลดหย่อน (สต.)", value: cleanValue(props.column_11?.value) },
                        ];

                        return (
                            <>
                                <hr className="border-top border-2 border-secondary mt-2 mb-1" />
                                <div key={`detail-${index}`}>
                                    {detailFields.map(({ label, value }) =>
                                        value ? (
                                            <div key={label}>
                                                <div className="fw-bold">{label}</div>
                                                <div className="border rounded-2 shadow-sm bg-white p-2 mb-2" style={{ fontSize: "14px" }}>
                                                    {value}
                                                </div>
                                            </div>
                                        ) : null
                                    )}
                                </div>
                            </>
                        );
                    })}
                </>
            )}

        </div>
    );
};

export default ChecklistTaxForm0503;
