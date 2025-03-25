import React from "react";
import { TableData } from "../../types/tableTypes";

interface MatchTableProps {
    data: TableData;
}

const MatchTable: React.FC<MatchTableProps> = ({ data }) => {
    return (
        <div className="table-responsive shadow-sm rounded py-3 px-5 bg-white mt-3">
            <p className="fw-bold mb-2" style={{ fontSize: '26px', fontFamily: 'IBM Plex Sans Thai' }}>ตารางเปรียบเทียบอัตราส่วนกับสูตรการผลิตน้ำมัน</p>
            <table className="table table-bordered border-dark">
                <thead>
                    <tr>
                        {data.headers.map((header, index) => (
                            <th key={index} className="text-center align-middle">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td rowSpan={data.items.length + 1} className="text-center fw-bold align-start">{data.productName}</td>
                    </tr>
                    {data.items.map((item, index) => (
                        <tr key={index}>
                            <td>{item.name}</td>
                            <td className="text-end">{item.quantity.toLocaleString()}</td>
                            <td className="text-end">{item.unitValue.toFixed(8)}</td>
                            <td className="text-end">{item.productionFormula}</td>
                            <td>{item.note || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MatchTable;
