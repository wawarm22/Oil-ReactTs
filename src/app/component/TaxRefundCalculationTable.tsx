import React from "react";
import { TaxRefundItem } from "../../types/taxRefundTypes";
import { readableNumber } from "../../utils/function/format";

interface Props {
    data: TaxRefundItem[];
}

const TaxRefundCalculationTable: React.FC<Props> = ({ data }) => {
    return (
        <div className="table-responsive bg-white shadow-sm rounded p-4 mt-3">
            <p className="fw-bold mb-2" style={{ fontSize: '26px', fontFamily: 'IBM Plex Sans Thai' }}>
                ตารางเปรียบเทียบภาษีสรรพสามิตที่ต้องชำระ (แบบ ภส.03-07) เทียบกับภาษีสรรพสามิตที่ขอหักลดหย่อน (ภส.05-03)
            </p>
            <table className="table table-bordered border-dark text-center align-middle" style={{ fontSize: "13.5px" }}>
                <thead>
                    <tr>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={3}>วันที่</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} colSpan={4}>ภาษีที่ต้องชำระ (ภส.03-07)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} colSpan={4}>ภาษีขอคืนลดหย่อน (ภส.05-03)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} colSpan={3}>จำนวนเงินภาษีส่วนเกิน (ขอคืน)</th>
                    </tr>
                    <tr>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>น้ำมันสำเร็จรูป (ลิตร)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>อัตราภาษี</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>ภาษีสรรพสามิต (บาท)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>ภาษีเก็บเพิ่มขึ้นเพื่อราชการส่วนท้องถิ่น (บาท)</th>

                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>น้ำมันพื้นฐาน (ลิตร)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>อัตราภาษี</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>ภาษีสรรพสามิต (บาท)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>ภาษีเก็บเพิ่มขึ้นเพื่อราชการส่วนท้องถิ่น (บาท)</th>

                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>ส่วนต่างภาษีสรรพสามิต (บาท)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>รายการส่วนท้องถิ่น (บาท)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>คืนภาษีทั้งสิ้น</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => {
                        const cellStyle = { background: typeof row.date === "string" ? "#E8E8E8" : "" };
                        return (
                            <tr key={index}>
                                <td style={cellStyle}>{row.date}</td>
                                <td className="text-end" style={cellStyle}>{readableNumber(row.finishedOilVolume, 2)}</td>
                                <td className="text-end" style={cellStyle}>{row.taxRate03_07.toFixed(4)}</td>
                                <td className="text-end" style={cellStyle}>{readableNumber(row.exciseTax03_07, 2)}</td>
                                <td className="text-end" style={cellStyle}>{readableNumber(row.surcharge03_07, 2)}</td>
                                <td className="text-end" style={cellStyle}>{readableNumber(row.baseOilVolume, 2)}</td>
                                <td className="text-end" style={cellStyle}>{row.taxRate05_03.toFixed(4)}</td>
                                <td className="text-end" style={cellStyle}>{readableNumber(row.exciseTax05_03, 2)}</td>
                                <td className="text-end" style={cellStyle}>{readableNumber(row.surcharge05_03, 2)}</td>
                                <td className="text-end" style={cellStyle}>{readableNumber(row.taxDiff, 2)}</td>
                                <td className="text-end" style={cellStyle}>{readableNumber(row.surchargeTotal, 2)}</td>
                                <td className="text-end" style={cellStyle}>{readableNumber(row.taxRefund, 2)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TaxRefundCalculationTable;
