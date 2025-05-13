import React from "react";
import { MaterialUsageData, ProductionData } from "../../types/productionTypes";

export const MaterialUsageTable: React.FC<{ data: MaterialUsageData }> = ({ data }) => (
    <div className="table-responsive shadow-sm rounded py-3 px-5 bg-white mt-3" style={{ fontFamily: 'IBM Plex Sans Thai' }}>
        <p className="fw-bold mb-4" style={{ fontSize: "20px" }}>
            ตารางเปรียบเทียบปริมาณการจ่ายวัถุดิบเปรียบเทียบกับปริมาณการผลิตและจำหน่าย
        </p>
        <p className="fw-bold mb-2" style={{ fontSize: '20px' }}>
            1. งบวัตถุดิบ 07-01
        </p>
        <table className="table table-bordered border-dark align-middle text-center">
            <thead>
                <tr>
                    {data.headers.map((header, idx) => (
                        <th key={idx}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.items.map((row, idx) => (
                    <tr key={idx}>
                        <td>{row.item}</td>
                        {row.values.map((value, vIdx) => (
                            <td key={vIdx} className="text-end">{value.toLocaleString()}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const ProductionTable: React.FC<{ data: ProductionData }> = ({ data }) => (
    <div className="table-responsive shadow-sm rounded py-3 px-5 bg-white mt-3">
        <p className="fw-bold mb-2" style={{ fontSize: '20px', fontFamily: 'IBM Plex Sans Thai' }}>
            2. งบการผลิต 07-02
        </p>
        <table className="table table-bordered border-dark align-middle text-center">
            <thead>
                <tr>
                    {data.headers.map((header, idx) => (
                        <th key={idx}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.items.map((row, idx) => (
                    <tr key={idx}>
                        <td>{row.item}</td>
                        {row.values.map((value, vIdx) => (
                            <td key={vIdx} className="text-end">{value.toLocaleString()}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
