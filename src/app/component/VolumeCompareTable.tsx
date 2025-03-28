import React from "react";
import { VolumeCompareData } from "../../types/volumeTableTypes";

interface Props {
    data: VolumeCompareData;
}

const VolumeCompareTable: React.FC<Props> = ({ data }) => {
    const totals = data.rows.reduce(
        (acc, row) => ({
            baseOil: acc.baseOil + row.baseOil,
            ethanol: acc.ethanol + row.ethanol,
            additive: acc.additive + row.additive,
            total_07_01: acc.total_07_01 + row.total_07_01,
            total_07_02: acc.total_07_02 + row.total_07_02,
            total_03_07: acc.total_03_07 + row.total_03_07,
        }),
        {
            baseOil: 0,
            ethanol: 0,
            additive: 0,
            total_07_01: 0,
            total_07_02: 0,
            total_03_07: 0,
        }
    );

    return (
        <div className="table-responsive shadow-sm rounded py-3 px-5 bg-white mt-3">
            <p className="fw-bold mb-2" style={{ fontSize: "26px", fontFamily: "IBM Plex Sans Thai" }}>
                ตารางเปรียบเทียบปริมาณการจ่ายวัถุดิบเปรียบเทียบกับปริมาณการผลิตและจำหน่าย
            </p>
            <table className="table table-bordered text-center">
                <thead className="align-middle text-center">
                    <tr>
                        {data.headers[0].map((label, idx) => {
                            if (label === "วันที่" || label === "ผลต่าง") {
                                return <th key={idx} rowSpan={2}>{label}</th>;
                            }

                            if (label !== "") {
                                const colSpan = data.headers[1].filter((_h, i) => data.headers[0][i] === "").length;
                                return <th key={idx} colSpan={colSpan}>{label}</th>;
                            }

                            return null;
                        })}
                    </tr>
                    <tr>
                        {data.headers[1].map((subLabel, idx) =>
                            subLabel ? <th key={idx}>{subLabel}</th> : null
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.rows.map((row, i) => (
                        <tr key={i}>
                            <td>{row.date}</td>
                            <td>{row.baseOil.toLocaleString()}</td>
                            <td>{row.ethanol.toLocaleString()}</td>
                            <td>{row.additive.toLocaleString()}</td>
                            <td>{row.total_07_01.toLocaleString()}</td>
                            <td>{row.total_07_02.toLocaleString()}</td>
                            <td>{row.total_03_07.toLocaleString()}</td>
                            <td></td>
                        </tr>
                    ))}

                    <tr className="fw-bold">
                        <td>รวม</td>
                        <td>{totals.baseOil.toLocaleString()}</td>
                        <td>{totals.ethanol.toLocaleString()}</td>
                        <td>{totals.additive.toLocaleString()}</td>
                        <td>{totals.total_07_01.toLocaleString()}</td>
                        <td>{totals.total_07_02.toLocaleString()}</td>
                        <td>{totals.total_03_07.toLocaleString()}</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default VolumeCompareTable;
