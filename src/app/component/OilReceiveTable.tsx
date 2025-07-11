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
                ตารางบัญชีรับ - จ่ายน้ำมันที่นำมาใช้เป็นวัตถุดิบในการผลิต (บัญชีสิทธิ์)
            </p>
            <table className="table table-bordered border-dark text-center align-middle" style={{ fontSize: "13.5px"}}>
                <thead className="align-middle">
                    <tr>
                        <th style={{ backgroundColor: "#E8E8E8" }} colSpan={10}>การรับ</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} colSpan={12}>การจำหน่าย</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} colSpan={3}>การใช้สิทธิ์</th>
                        <th className="align-bottom" rowSpan={4} style={{ backgroundColor: "#E8E8E8", minWidth: "300px" }}>ปริมาณน้ำมันที่มีสิทธิหักลดหย่อนคงเหลือ</th>
                        <th className="align-bottom" rowSpan={4} style={{ backgroundColor: "#E8E8E8", minWidth: "100px" }}>หมายเหตุ</th>
                    </tr>
                    <tr>
                        <th style={{ backgroundColor: "#E8E8E8" }} colSpan={10}>หลักฐานการซื้อขายน้ำมันจากโรงกลั่น (ใบกำกับภาษี)/หลักฐานการซื้อน้ำมันที่คลังรับจากการโอนสต๊อก</th>
                        <th className="align-bottom" rowSpan={3} style={{ backgroundColor: "#E8E8E8", minWidth: "90px" }}>วันที่จำหน่าย</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} colSpan={5}>จำหน่ายในประเทศ</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} colSpan={4}>โอนคลัง</th>
                        <th className="align-bottom" rowSpan={3} style={{ backgroundColor: "#E8E8E8", minWidth: "100px" }}>อื่น ๆ</th>
                        <th className="align-bottom" rowSpan={3} style={{ backgroundColor: "#E8E8E8", minWidth: "100px" }}>รวมจ่าย</th>
                        
                        <th style={{ backgroundColor: "#E8E8E8" }} colSpan={3}>ปริมาณน้ำมันที่มีสิทธิหักลดหย่อนคงเหลือตามใบกำกับภาษีแต่ละฉบับ</th>
                    </tr>
                    <tr>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "94px" }}>วันที่รับน้ำมัน</th>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "190px" }}>เลขที่ใบกำกับภาษีโรงกลั่น</th>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "200px" }}>เลขที่ใบกำกับภาษีการโอน</th>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "120px" }}>วดป.</th>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "130px" }}>Vendor Code</th>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "130px" }}>ชื่อโรงกลั่น/คลัง</th>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "220px" }}>ปริมาณน้ำมัน (ใบกำกับภาษี)</th>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "200px" }}>ปริมาณน้ำมันที่ตรวจรับจริง</th>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "100px" }}>อัตราภาษี</th>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "280px" }}>ปริมาณน้ำมันที่ส่งออกลดหย่อนภาษี</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} colSpan={2}>แบบผสมสารเพิ่มคุณภาพ</th>
                        <th colSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "220px" }}>แบบไม่ผสมสารเพิ่มคุณภาพ</th>
                        <th style={{ backgroundColor: "#E8E8E8" }} colSpan={3}>แบบผสมสารเพิ่มคุณภาพ</th>
                        <th colSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "220px" }}>แบบไม่ผสมสารเพิ่มคุณภาพ</th>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "140px" }}>เลขที่ใบกำกับภาษี</th>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "170px" }}>ปริมาณที่ใช้ลดหย่อน</th>
                        <th className="align-bottom" rowSpan={2} style={{ backgroundColor: "#E8E8E8", minWidth: "230px" }}>ปริมาณคงเหลือ (ใบกำกับ)</th>
                    </tr>
                    <tr>
                        <th style={{ backgroundColor: "#E8E8E8", minWidth: "140px" }}>เลขที่ใบกำกับภาษี</th>
                        <th style={{ backgroundColor: "#E8E8E8" }}>ปริมาณ</th>
                        <th style={{ backgroundColor: "#E8E8E8", minWidth: "120px" }}>เลขที่ใบกำกับภาษี</th>
                        <th style={{ backgroundColor: "#E8E8E8" }}>ปริมาณ</th>
                        <th style={{ backgroundColor: "#E8E8E8", minWidth: "120px" }}>คลังปลายทาง</th>
                        <th style={{ backgroundColor: "#E8E8E8", minWidth: "140px" }}>เลขที่ใบกำกับภาษี</th>
                        <th style={{ backgroundColor: "#E8E8E8" }}>ปริมาณ</th>
                        <th style={{ backgroundColor: "#E8E8E8", minWidth: "120px" }}>เลขที่ใบกำกับภาษี</th>
                        <th style={{ backgroundColor: "#E8E8E8" }}>ปริมาณ</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx}>
                            <td className="text-start">{row.receiveDate || ""}</td>
                            <td className="text-start">{row.receiveDocNo}</td>
                            <td>{row.taxDocNo || ""}</td>
                            <td>{row.jvNo || ""}</td>
                            <td>{row.vendorCode || ""}</td>
                            <td className="text-start">
                                <VendorNamePopover slug={row.vendorName} name={row.vendorFullName} />
                            </td>
                            <td className="text-end">{readableNumber(safeNumber(row.quantityBeforeTax))}</td>
                            <td className="text-end">{readableNumber(safeNumber(row.quantityActual))}</td>
                            <td className="text-end">{readableNumber(safeNumber(row.taxRate))}</td>
                            <td></td>
                            <td className="text-start">{row.sellDate || ""}</td>
                            <td className="text-start">{row.sellDomTaxDocNo || ""}</td>
                            <td className="text-end">{readableNumber(safeNumber(row.sellDomTaxQty))}</td>
                            <td></td>
                            <td></td>
                            <td className="text-start">{row.transferToFactory || ""}</td>
                            <td className="text-start">{row.transferTaxNo || ""}</td>
                            <td className="text-end">{readableNumber(safeNumber(row.transferTaxQty))}</td>
                            <td></td>
                            <td className="text-start">{row.other || ""}</td>
                            <td></td>
                            <td>{row.permissionDocNo || ""}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="text-start">{row.remark || ""}</td>
                            <td></td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OilReceiveTable;
