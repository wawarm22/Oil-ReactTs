import React from "react";
import { VolumeCompareData } from "../../types/volumeTableTypes";

interface VolumeCompareTableProps {
    data: VolumeCompareData;
}

const VolumeCompareTable: React.FC<VolumeCompareTableProps> = ({ data }) => {
    return (
        <div className="table-responsive shadow-sm rounded py-3 px-5 bg-white mt-3">
            <p className="fw-bold mb-2" style={{ fontSize: '26px', fontFamily: 'IBM Plex Sans Thai' }}>
                ตารางเปรียบเทียบปริมาณการจ่ายวัถุดิบเปรียบเทียบกับปริมาณการผลิตและจำหน่าย
            </p>
            <table className="table table-bordered border-dark align-middle text-center">
                <thead>
                    <tr>
                        <th rowSpan={2}>วันที่</th>
                        <th colSpan={data.materialNames.length + 1}>ปริมาณการจ่ายวัตถุดิบ ภส. 07-01</th>
                        <th colSpan={1}>ภส.07-02</th>
                        <th colSpan={1}>ภส.03-07</th>
                        <th rowSpan={2}>เปรียบเทียบผลต่าง<br />ภส.07-01 กับ ภส.07-02</th>
                        <th rowSpan={2}>เปรียบเทียบผลต่าง<br />ภส.07-01 กับ ภส.03-07</th>
                    </tr>
                    <tr>
                        {data.materialNames.map((name, idx) => (
                            <th key={idx}>{name}</th>
                        ))}
                        <th style={{ backgroundColor: "rgba(34, 198, 89, 0.1)" }}>ปริมาณรวม (ลิตร)</th>
                        <th style={{ backgroundColor: "rgba(34, 198, 89, 0.1)" }}>ปริมาณการผลิตและจำหน่าย</th>
                        <th style={{ backgroundColor: "rgba(34, 198, 89, 0.1)" }}>ปริมาณการชำระภาษี</th>
                    </tr>

                </thead>

                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.date}</td>
                            {data.materialNames.map((name, matIdx) => (
                                <td key={matIdx} className="text-end">
                                    {item.materials[name]?.toLocaleString() ?? "-"}
                                </td>
                            ))}
                            <td className="text-end" style={{ backgroundColor: "rgba(34, 198, 89, 0.1)" }}>{item.totalVolume.toLocaleString()}</td>
                            <td className="text-end" style={{ backgroundColor: "rgba(34, 198, 89, 0.1)" }}>{item.productionVolume.toLocaleString()}</td>
                            <td className="text-end" style={{ backgroundColor: "rgba(34, 198, 89, 0.1)" }}>{item.taxVolume.toLocaleString()}</td>
                            <td>{item.compareWithProduction}</td>
                            <td>{item.compareWithTax}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VolumeCompareTable;
