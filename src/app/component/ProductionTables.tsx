import React from "react";
import { MaterialUsageData, ProductionData } from "../../types/productionTypes";
import { readableNumber } from "../../utils/function/format";

export const MaterialUsageTable: React.FC<{ data: MaterialUsageData }> = ({ data }) => (
    <div className="table-responsive shadow-sm rounded py-3 px-5 bg-white mt-3" >
        <p className="fw-bold mb-4" style={{ fontSize: "20px" }}>
            ตารางแบบ ภส.07-04 แบบงบเดือนแสดงรายการวัตถุดิบ การผลิต การจำหน่ายและยอดคงเหลือสินค้า
        </p>
        <p className="fw-bold mb-2" style={{ fontSize: '20px' }}>
            1. งบวัตถุดิบ 07-01
        </p>
        <table className="table table-bordered border-dark align-middle text-center" style={{ fontSize: "13.5px"}}>
            <thead>
                <tr>
                    {data.headers.map((header, idx) => (
                        <th key={idx} style={{ backgroundColor: "#E8E8E8" }}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.items.map((row, idx) => (
                    <tr key={idx}>
                        <td className= "fw-bold text-start" style={{ backgroundColor: "#E8E8E8" }}>{row.item}</td>
                        {row.values.map((value, vIdx) => (
                            <td key={vIdx} className="text-end">{readableNumber(value)}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const ProductionTable: React.FC<{ data: ProductionData }> = ({ data }) => (
    <div className="table-responsive shadow-sm rounded py-3 px-5 bg-white mt-3">
        <p className="fw-bold mb-2" style={{ fontSize: '20px' }}>
            2. งบการผลิต 07-02
        </p>
        <table className="table table-bordered border-dark align-middle text-center" style={{ fontSize: "13.5px"}}>
            <thead>
                <tr>
                    {data.headers.map((header, idx) => (
                        <th key={idx} style={{ backgroundColor: "#E8E8E8" }}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.items.map((row, idx) => (
                    <tr key={idx}>
                        <td className= "fw-bold text-start" style={{ backgroundColor: "#E8E8E8" }}>{row.item}</td>
                        {row.values.map((value, vIdx) => (
                            <td key={vIdx} className="text-end">{readableNumber(value)}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
