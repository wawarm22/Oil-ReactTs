import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { barData, barOptions } from "../../utils/chartData";
import { DATASET_LABELS } from "../../types/enum/chartData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardChart: React.FC = () => {

    const requestedDataset = barData.datasets.find(
        (d) => d.label === DATASET_LABELS.REQUESTED
    );

    const refundedDataset = barData.datasets.find(
        (d) => d.label === DATASET_LABELS.REFUNDED
    );

    const totalRequested = requestedDataset
        ? requestedDataset.data.reduce((sum, val) => sum + val, 0)
        : 0;

    const totalRefunded = refundedDataset
        ? refundedDataset.data.reduce((sum, val) => sum + val, 0)
        : 0;

    return (
        <div className="container-fluid w-100 d-flex justify-content-center mt-3">
            <div
                className="card p-4 shadow-sm"
                style={{
                    maxWidth: "1800px",
                    width: "100%",
                    borderRadius: "12px",
                    fontFamily: "IBM Plex Sans Thai",
                }}
            >
                <div className="container-fluid" style={{ maxWidth: "1400px" }}>
                    <p className="fw-bold mb-3" style={{ fontSize: "32px" }}>จำนวนเงิินขอลดหย่อนเเละการคืนภาษี</p>
                    <div className="d-flex flex-wrap gap-5 mb-3">
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: "4px", height: "50px", backgroundColor: "#FFCC01" }} />
                            <div>
                                <p className="m-0" style={{ fontWeight: "bold" }}>
                                    จำนวนเงินขอลดหย่อนภาษีทั้งหมด
                                </p>
                                <p className="m-0" style={{ fontSize: "24px", fontWeight: 600 }}>
                                    {totalRequested.toLocaleString()} บาท
                                </p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: "4px", height: "50px", backgroundColor: "#55D88C" }} />
                            <div>
                                <p className="m-0" style={{ fontWeight: "bold" }}>
                                    จำนวนภาษีที่ได้รับการลดหย่อนและได้คืน
                                </p>
                                <p className="m-0" style={{ fontSize: "24px", fontWeight: 600 }}>
                                    {totalRefunded.toLocaleString()} บาท
                                </p>
                            </div>
                        </div>
                    </div>
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>
        </div>
    );
};

export default DashboardChart;
