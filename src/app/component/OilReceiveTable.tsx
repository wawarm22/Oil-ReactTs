import React from "react";
import { OilReceiveItem } from "../../types/oilReceiveTypes";

interface Props {
    data: OilReceiveItem[];
}

const OilReceiveTable: React.FC<Props> = ({ data }) => {
    return (
        <div className="table-responsive bg-white shadow-sm rounded p-4 mt-3">
            <table className="table table-bordered border-dark text-center align-middle">
                <thead>
                    <tr>
                        <th rowSpan={3}>วันที่รับน้ำมัน</th>
                        <th colSpan={7}>หลักฐานการซื้อน้ำมัน</th>
                        <th colSpan={2}>ปริมาณน้ำมันที่ส่งออกลดหย่อนภาษี</th>
                        <th colSpan={4}>จำหน่ายในประเทศ</th>
                        <th colSpan={4}>การจัดจำหน่าย (โอนคลัง)</th>
                        <th rowSpan={3}>อื่น ๆ</th>
                        <th rowSpan={3}>รวมใช้</th>
                        <th colSpan={3}>การใช้สิทธิ์</th>
                        <th rowSpan={3}>หมายเหตุ</th>
                    </tr>
                    <tr>
                        <th rowSpan={2}>เลขที่ใบกำกับภาษี</th>
                        <th rowSpan={2}>เลขที่ใบกำกับภาษีการโอน</th>
                        <th rowSpan={2}>จวป.</th>
                        <th rowSpan={2}>Vendor Code</th>
                        <th rowSpan={2}>ชื่อโรงกลั่น</th>
                        <th rowSpan={2}>ปริมาณน้ำมัน (ใบกำกับภาษี)</th>
                        <th rowSpan={2}>ปริมาณน้ำมันที่ตรวจรับจริง</th>
                        <th rowSpan={2}>อัตราภาษี</th>
                        <th rowSpan={2}>วันที่จำหน่าย</th>

                        <th colSpan={2}>แบบมีเลขที่ใบกำกับภาษี</th>
                        <th colSpan={2}>แบบไม่มีเลขที่ใบกำกับภาษี</th>
                        <th colSpan={2}>แบบมีเลขที่ใบกำกับภาษี</th>
                        <th colSpan={2}>แบบไม่มีเลขที่ใบกำกับภาษี</th>
                        <th rowSpan={2}>เลขที่ใบกำกับภาษี</th>
                        <th rowSpan={2}>ปริมาณที่ได้รับผ่อนผัน</th>
                        <th rowSpan={2}>ปริมาณที่ขอใช้สิทธิ์หักลดหย่อน</th>
                    </tr>
                    <tr>
                        <th>เลขที่ใบกำกับ</th>
                        <th>ปริมาณ</th>
                        <th>เลขที่ใบกำกับ</th>
                        <th>ปริมาณ</th>
                        <th>เลขที่ใบกำกับ</th>
                        <th>ปริมาณ</th>
                        <th>เลขที่ใบกำกับ</th>
                        <th>ปริมาณ</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.receiveDate || ""}</td>
                            <td>{row.receiveDocNo}</td>
                            <td>{row.taxDocNo || ""}</td>
                            <td>{row.jvNo || ""}</td>
                            <td>{row.vendorCode || ""}</td>
                            <td>{row.vendorName || "GC"}</td>
                            <td className="text-end">{row.quantityBeforeTax.toLocaleString()}</td>
                            <td className="text-end">{row.quantityActual?.toLocaleString() || ""}</td>
                            <td>{row.taxRate || ""}</td>
                            <td>{row.sellDate || ""}</td>
                            <td>{row.sellDomTaxDocNo || ""}</td>
                            <td className="text-end">{row.sellDomTaxQty?.toLocaleString() || ""}</td>
                            <td>{row.sellDomNonTaxDocNo || ""}</td>
                            <td className="text-end">{row.sellDomNonTaxQty?.toLocaleString() || ""}</td>
                            <td>{row.sellWhTaxDocNo || ""}</td>
                            <td className="text-end">{row.sellWhTaxQty?.toLocaleString() || ""}</td>
                            <td>{row.sellWhNonTaxDocNo || ""}</td>
                            <td className="text-end">{row.sellWhNonTaxQty?.toLocaleString() || ""}</td>
                            <td>{row.other || ""}</td>
                            <td className="text-end">{row.totalUsed.toLocaleString()}</td>
                            <td>{row.permissionDocNo || ""}</td>
                            <td className="text-end">{row.permissionQty?.toLocaleString() || ""}</td>
                            <td className="text-end">{row.usedQty.toLocaleString()}</td>
                            <td className="text-end">{row.usedQtyBalance.toLocaleString()}</td>
                            {/* <td>{row.remark || ""}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OilReceiveTable;
