import React from "react";
import { TaxRefundItem } from "../../types/taxRefundTypes";
import { readableNumber } from "../../utils/function/format";

interface Props {
    data: TaxRefundItem[];
}

const TaxRefundCalculationTable: React.FC<Props> = ({ data }) => {
    return (
        <div className="table-responsive bg-white shadow-sm rounded p-4 mt-3">
            <table className="table table-bordered border-dark text-center align-middle" style={{ fontSize: "13.5px"}}>
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

                        <th style={{ backgroundColor: "#E8E8E8" }}rowSpan={2}>น้ำมันพื้นฐาน (ลิตร)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>อัตราภาษี</th>
                        <th style={{ backgroundColor: "#E8E8E8" }}rowSpan={2}>ภาษีสรรพสามิต (บาท)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>ภาษีเก็บเพิ่มขึ้นเพื่อราชการส่วนท้องถิ่น (บาท)</th>

                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>ส่วนต่างภาษีสรรพสามิต (บาท)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>รายการส่วนท้องถิ่น (บาท)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} rowSpan={2}>คืนภาษีทั้งสิ้น</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (                        
                        <tr style={{ backgroundColor: index === 31 ? "#E8E8E8" : ""}} key={index}>
                            <td>{row.date}</td>
                            <td className="text-end">{readableNumber(row.finishedOilVolume, 2)}</td>
                            <td className="text-end">{row.taxRate03_07.toFixed(4)}</td>
                            <td className="text-end">{readableNumber(row.exciseTax03_07, 2)}</td>
                            <td className="text-end">{readableNumber(row.surcharge03_07, 2)}</td>

                            <td className="text-end">{readableNumber(row.baseOilVolume, 2)}</td>
                            <td className="text-end">{row.taxRate05_03.toFixed(4)}</td>
                            <td className="text-end">{readableNumber(row.exciseTax05_03, 2)}</td>
                            <td className="text-end">{readableNumber(row.surcharge05_03, 2)}</td>

                            <td className="text-end">{readableNumber(row.taxDiff, 2)}</td>
                            <td className="text-end">{readableNumber(row.surchargeTotal, 2)}</td>
                            <td className="text-end">{readableNumber(row.taxRefund, 2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaxRefundCalculationTable;
