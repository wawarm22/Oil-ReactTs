import React from "react";
import { TaxRefundItem } from "../../types/taxRefundTypes";

interface Props {
    data: TaxRefundItem[];
}

const TaxRefundCalculationTable: React.FC<Props> = ({ data }) => {
    return (
        <div className="table-responsive bg-white shadow-sm rounded p-4 mt-3">
            <table className="table table-bordered border-dark text-center align-middle">
                <thead>
                    <tr>
                        <th rowSpan={3}>วันที่</th>
                        <th colSpan={4}>ภาษีที่ต้องชำระ (ภส.03-07)</th>
                        <th colSpan={4}>ภาษีขอคืนลดหย่อน (ภส.05-03)</th>
                        <th colSpan={3}>จำนวนเงินภาษีส่วนเกิน (ขอคืน)</th>
                    </tr>
                    <tr>
                        <th rowSpan={2}>น้ำมันสำเร็จรูป (ลิตร)</th>
                        <th rowSpan={2}>อัตราภาษี</th>
                        <th rowSpan={2}>ภาษีสรรพสามิต (บาท)</th>
                        <th rowSpan={2}>ใช้ภาษีเก็บเพิ่มฯ (บาท)</th>

                        <th rowSpan={2}>น้ำมันพื้นฐาน (ลิตร)</th>
                        <th rowSpan={2}>อัตราภาษี</th>
                        <th rowSpan={2}>ภาษีสรรพสามิต (บาท)</th>
                        <th rowSpan={2}>ใช้ภาษีเก็บเพิ่มฯ (บาท)</th>

                        <th rowSpan={2}>ส่วนต่างภาษีสรรพสามิต (บาท)</th>
                        <th rowSpan={2}>รายการส่วนท้องถิ่น (บาท)</th>
                        <th rowSpan={2}>คืนภาษีทั้งสิ้น (บาท)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.date}</td>
                            <td className="text-end">{row.finishedOilVolume.toLocaleString()}</td>
                            <td className="text-end">{row.taxRate03_07.toFixed(4)}</td>
                            <td className="text-end">{row.exciseTax03_07.toLocaleString()}</td>
                            <td className="text-end">{row.surcharge03_07.toLocaleString()}</td>

                            <td className="text-end">{row.baseOilVolume.toLocaleString()}</td>
                            <td className="text-end">{row.taxRate05_03.toFixed(4)}</td>
                            <td className="text-end">{row.exciseTax05_03.toLocaleString()}</td>
                            <td className="text-end">{row.surcharge05_03.toLocaleString()}</td>

                            <td className="text-end">{row.taxDiff.toLocaleString()}</td>
                            <td className="text-end">{row.surchargeTotal.toLocaleString()}</td>
                            <td className="text-end">{row.taxRefund.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaxRefundCalculationTable;
