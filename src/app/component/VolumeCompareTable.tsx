import React from "react";
import { VolumeCompareData } from "../../types/volumeTableTypes";

interface VolumeCompareTableProps {
    data: VolumeCompareData;
}

const VolumeCompareTable: React.FC<VolumeCompareTableProps> = ({ data }) => {
    return (
        <div className="table-responsive shadow-sm rounded py-3 px-5 bg-white mt-3">
            <p className="fw-bold mb-2" style={{ fontSize: '26px', fontFamily: 'IBM Plex Sans Thai' }}>
                ตารางเปรียบเทียบปริมาณการจ่ายวัตถุดิบ และการชำระภาษี
            </p>
            <table className="table table-bordered border-dark align-middle text-center">
                <thead>
                    <tr>
                        <th rowSpan={2}>วันที่</th>
                        <th colSpan={4}>ปริมาณการจ่ายวัตถุดิบ ภส. 07-01</th>
                        <th colSpan={1}>ภส.07-02</th>
                        <th colSpan={1}>ภส.03-07</th>
                        <th rowSpan={2}>เปรียบเทียบผลต่าง<br />ภส.07-01 กับ ภส.07-02</th>
                        <th rowSpan={2}>เปรียบเทียบผลต่าง<br />ภส.07-01 กับ ภส.03-07</th>
                    </tr>
                    <tr>
                        <th>น้ำมันพื้นฐาน</th>
                        <th>เอทานอล</th>
                        <th>สารเติมแต่ง</th>
                        <th>ปริมาณรวม (ลิตร)</th>
                        <th>ปริมาณการผลิตและจำหน่าย</th>                        
                        <th>ปริมาณการชำระภาษี</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.date}</td>
                            <td className="text-end">{item.baseOil.toLocaleString()}</td>
                            <td className="text-end">{item.ethanol.toLocaleString()}</td>
                            <td className="text-end">{item.additive.toLocaleString()}</td>
                            <td className="text-end">{item.totalVolume.toLocaleString()}</td>
                            <td className="text-end">{item.productionVolume.toLocaleString()}</td>
                            <td className="text-end">{item.taxVolume.toLocaleString()}</td>
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
