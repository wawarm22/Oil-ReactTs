import React from "react";
import { OilReceiveItem } from "../../types/oilReceiveTypes";
import { readableNumber, safeNumber } from "../../utils/function/format";
import VendorNamePopover from "../reusable/VendorNamePopover";

interface Props {
    data: OilReceiveItem[];
}

const OilReceiveTable: React.FC<Props> = ({ data }) => {
    return (
        <div className="table-responsive bg-white shadow-sm rounded p-4 mt-3">
            <p className="fw-bold mb-2" style={{ fontSize: '26px', fontFamily: 'IBM Plex Sans Thai' }}>
                ตารางเปรียบเทียบอัตราส่วนกับสูตรการผลิตน้ำมัน
            </p>
            <table className="table table-bordered border-dark text-center align-middle">
                <thead className="align-middle">
                    <tr>
                        <th colSpan={10}>การรับ</th>
                        <th colSpan={12}>การจำหน่าย</th>
                        <th colSpan={3}>การใช้สิทธิ์</th>
                        <th rowSpan={4}>ปริมาณน้ำมันที่มีสิทธิหักลดหย่อนคงเหลือ</th>
                        <th rowSpan={4}>หมายเหตุ</th>
                    </tr>
                    <tr>
                        <th rowSpan={3}>วันที่รับน้ำมัน</th>
                        <th colSpan={8}>หลักฐานการซื้อขายน้ำมันจากโรงกลั่น (ใบกำกับภาษี)/หลักฐานการซื้อน้ำมันที่คลังรับจากการโอนสต๊อก</th>
                        <th rowSpan={3}>ปริมาณน้ำมันที่ส่งออกลดหย่อนภาษี</th>
                        <th rowSpan={3}>วันที่จำหน่าย</th>
                        <th colSpan={4}>จำหน่ายในประเทศ</th>
                        <th colSpan={5}>โอนคลัง</th>
                        <th rowSpan={3}>อื่น ๆ</th>
                        <th rowSpan={3}>รวมจ่าย</th>
                        <th colSpan={3}>ปริมาณน้ำมันที่มีสิทธิหักลดหย่อนคงเหลือตามใบกำกับภาษีแต่ละฉบับ</th>
                    </tr>
                    <tr>
                        <th rowSpan={2}>เลขที่ใบกำกับภาษีโรงกลั่น</th>
                        <th rowSpan={2}>เลขที่ใบกำกับภาษีการโอน</th>
                        <th rowSpan={2}>วดป.</th>
                        <th rowSpan={2}>Vendor Code</th>
                        <th rowSpan={2}>ชื่อโรงกลั่น/คลัง</th>
                        <th rowSpan={2}>ปริมาณน้ำมัน (ใบกำกับภาษี)</th>
                        <th rowSpan={2}>ปริมาณน้ำมันที่ตรวจรับจริง</th>
                        <th rowSpan={2}>อัตราภาษี</th>

                        <th colSpan={2}>แบบผสมสารเพิ่มคุณภาพ</th>
                        <th colSpan={2}>แบบไม่ผสมสารเพิ่มคุณภาพ</th>
                        <th colSpan={3}>แบบผสมสารเพิ่มคุณภาพ</th>
                        <th colSpan={2}>แบบไม่ผสมสารเพิ่มคุณภาพ</th>
                        <th rowSpan={2}>เลขที่ใบกำกับภาษี</th>
                        <th rowSpan={2}>ปริมาณที่ได้รับผ่อนผัน</th>
                        <th rowSpan={2}>ปริมาณที่ขอใช้สิทธิ์หักลดหย่อน</th>
                    </tr>
                    <tr>
                        <th>เลขที่ใบกำกับ</th>
                        <th>ปริมาณ</th>
                        <th>เลขที่ใบกำกับ</th>
                        <th>ปริมาณ</th>
                        <th>คลังปลายทาง</th>
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
                            <td>
                                <VendorNamePopover slug={row.vendorName} name={row.vendorFullName} />
                            </td>
                            <td className="text-end">{readableNumber(safeNumber(row.quantityBeforeTax))}</td>
                            <td></td>
                            <td>{row.taxRate || ""}</td>
                            <td></td>
                            <td>{row.sellDate || ""}</td>
                            <td>{row.sellDomTaxDocNo || ""}</td>
                            <td>{readableNumber(safeNumber(row.sellDomTaxQty))}</td>
                            <td></td>
                            <td></td>
                            <td>{row.transferToFactory || ""}</td>
                            <td>{row.transferTaxNo || ""}</td>
                            <td>{readableNumber(safeNumber(row.transferTaxQty))}</td>
                            <td></td>
                            <td>{row.other || ""}</td>
                            <td></td>
                            <td>{row.permissionDocNo || ""}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{row.remark || ""}</td>
                            <td></td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OilReceiveTable;
