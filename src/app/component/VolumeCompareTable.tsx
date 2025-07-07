import React from "react";
import { VolumeCompareData } from "../../types/volumeTableTypes";
import { readableNumber } from "../../utils/function/format";

interface VolumeCompareTableProps {
    data: VolumeCompareData;
}

const VolumeCompareTable: React.FC<VolumeCompareTableProps> = ({ data }) => {
    const totalSums = React.useMemo(() => {
        const sums: {
            [key: string]: number;
        } = {};
        data.materialNames.forEach(name => {
            sums[name] = data.items.reduce((acc, item) => acc + (item.materials[name] ?? 0), 0);
        });
        sums.totalVolume = data.items.reduce((acc, item) => acc + (item.totalVolume ?? 0), 0);
        sums.productionVolume = data.items.reduce((acc, item) => acc + (item.productionVolume ?? 0), 0);
        sums.taxVolume = data.items.reduce((acc, item) => acc + (item.taxVolume ?? 0), 0);
        sums.compareWithProduction = data.items.reduce((acc, item) => acc + ((item.totalVolume ?? 0) - (item.productionVolume ?? 0)), 0);
        sums.compareWithTax = data.items.reduce((acc, item) => acc + ((item.totalVolume ?? 0) - (item.taxVolume ?? 0)), 0);
        return sums;
    }, [data]);

    return (
        <div className="table-responsive shadow-sm rounded py-3 px-5 bg-white mt-3">
            <p className="fw-bold mb-2" style={{ fontSize: '26px', fontFamily: 'IBM Plex Sans Thai' }}>
                ตารางเปรียบเทียบปริมาณการจ่ายวัถุดิบเปรียบเทียบกับปริมาณการผลิตและจำหน่าย
            </p>
            <table className="table table-bordered border-dark align-middle text-center" style={{ fontSize: '13.5px' }}>
                <thead className="align-middle">
                    <tr>
                        <th rowSpan={2} style={{ backgroundColor: "#E8E8E8" }}>วันที่</th>
                        <th colSpan={data.materialNames.length + 1} style={{ backgroundColor: "#E8E8E8" }}>ปริมาณการจ่ายวัตถุดิบ ภส. 07-01</th>
                        <th colSpan={1} style={{ backgroundColor: "#E8E8E8" }}>ภส.07-02</th>
                        <th colSpan={1} style={{ backgroundColor: "#E8E8E8" }}>ภส.03-07</th>
                        <th rowSpan={2} style={{ backgroundColor: "#E8E8E8" }}>เปรียบเทียบผลต่าง<br />ภส.07-01 กับ ภส.07-02</th>
                        <th rowSpan={2} style={{ backgroundColor: "#E8E8E8" }}>เปรียบเทียบผลต่าง<br />ภส.07-01 กับ ภส.03-07</th>
                    </tr>
                    <tr>
                        {data.materialNames.map((name, idx) => (
                            <th key={idx} style={{ backgroundColor: "#E8E8E8" }}>{name}</th>
                        ))}
                        <th style={{ backgroundColor: "#E8E8E8" }}>ปริมาณรวม (ลิตร)</th>
                        <th style={{ backgroundColor: "#E8E8E8" }}>ปริมาณการผลิตและจำหน่าย</th>
                        <th style={{ backgroundColor: "#E8E8E8" }}>ปริมาณการชำระภาษี</th>
                    </tr>

                </thead>

                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.date}</td>
                            {data.materialNames.map((name, matIdx) => (
                                <td key={matIdx} className="text-end" style={{ minWidth: "180px"}}>
                                    {item.materials[name]?.toLocaleString() ?? "-"}
                                </td>
                            ))}
                            <td className="text-end" style={{ minWidth: "180px", backgroundColor: "rgba(34, 198, 89, 0.1)" }}>{item.totalVolume.toLocaleString()}</td>
                            <td className="text-end" style={{ minWidth: "180px", backgroundColor: "rgba(34, 198, 89, 0.1)" }}>{item.productionVolume.toLocaleString()}</td>
                            <td className="text-end" style={{ minWidth: "180px", backgroundColor: "rgba(34, 198, 89, 0.1)" }}>{item.taxVolume.toLocaleString()}</td>
                            <td className="text-end" style={{ minWidth: "180px" }}>{item.compareWithProduction}</td>
                            <td className="text-end" style={{ minWidth: "180px" }}>{item.compareWithTax}</td>
                        </tr>
                    ))}
                    <tr>
                        <td className="fw-bold">รวม</td>
                        {data.materialNames.map((name, matIdx) => (
                            <td key={matIdx} className="fw-bold text-end">
                                {readableNumber(totalSums[name], 0) ?? "-"}
                            </td>
                        ))}
                        <td className="fw-bold text-end" style={{ backgroundColor: "rgba(34, 198, 89, 0.1)" }}>
                            {readableNumber(totalSums.totalVolume, 0) ?? "-"}
                        </td>
                        <td className="fw-bold text-end" style={{ backgroundColor: "rgba(34, 198, 89, 0.1)" }}>
                            {readableNumber(totalSums.productionVolume, 0) ?? "-"}
                        </td>
                        <td className="fw-bold text-end" style={{ backgroundColor: "rgba(34, 198, 89, 0.1)" }}>
                            {readableNumber(totalSums.taxVolume, 0) ?? "-"}
                        </td>
                        <td className="fw-bold text-end">{readableNumber(totalSums.compareWithProduction, 0) ?? "-"}</td>
                        <td className="fw-bold text-end">{readableNumber(totalSums.compareWithTax, 0) ?? "-"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default VolumeCompareTable;
