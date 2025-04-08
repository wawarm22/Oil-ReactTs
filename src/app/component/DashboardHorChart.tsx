import React, { useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { horBarData, horBarOptions, lineChartData, lineChartOptions, lineMonthlyData, lineMonthlyOptions, monthlyBarData, monthlyBarOptions } from "../../utils/chartData";
import { DATASET_LABELS } from "../../types/enum/chartData";
import DashboardTabSelector from "../reusable/DashboardTabSelector";
import DateFilter from "../reusable/DateFilter";
import GraphTypeToggle from "./GraphTypeToggle";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const DashboardHorChart: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"yearly" | "monthly">("yearly");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [graphType, setGraphType] = useState<"line" | "bar">("bar");
    const isYearly = activeTab === "yearly";
    const chartData = isYearly ? horBarData : monthlyBarData;
    const chartOptions = isYearly ? horBarOptions : monthlyBarOptions;
    const lineData = isYearly ? lineChartData : lineMonthlyData;
    const lineOptions = isYearly ? lineChartOptions : lineMonthlyOptions;

    const requestedLineDataset = lineData.datasets.find(
        (d) => d.label === DATASET_LABELS.REQUESTED
    );

    const refundedLineDataset = lineData.datasets.find(
        (d) => d.label === DATASET_LABELS.REFUNDED
    );

    const requestedDataset = chartData.datasets.find(
        (d) => d.label === DATASET_LABELS.REQUESTED
    );

    const refundedDataset = chartData.datasets.find(
        (d) => d.label === DATASET_LABELS.REFUNDED
    );

    const totalRequestedLine = requestedLineDataset
        ? requestedLineDataset.data.reduce((sum, val) => sum + val, 0)
        : 0;

    const totalRefundedLine = refundedLineDataset
        ? refundedLineDataset.data.reduce((sum, val) => sum + val, 0)
        : 0;

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
                    <p className="fw-bold mb-3" style={{ fontSize: "32px" }}>จำนวนเงินขอลดหย่อนเเละการคืนภาษี</p>
                    <div className="d-flex flex-wrap gap-5" style={{ fontSize: '24px' }}>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: "4px", height: "65px", backgroundColor: "#FFCC01" }} />
                            <div>
                                <p className="m-0 fw-bold">
                                    จำนวนเงินขอลดหย่อนภาษีทั้งหมด
                                </p>
                                <p className="m-0 fw-bold" style={{ fontSize: "38px" }}>
                                    {(graphType === "bar" ? totalRequested : totalRequestedLine).toLocaleString()} บาท
                                </p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: "4px", height: "65px", backgroundColor: "#55D88C" }} />
                            <div>
                                <p className="m-0 fw-bold">
                                    จำนวนภาษีที่ได้รับการลดหย่อนและได้คืน
                                </p>
                                <p className="m-0 fw-bold" style={{ fontSize: "38px" }}>
                                    {(graphType === "bar" ? totalRefunded : totalRefundedLine).toLocaleString()} บาท
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="position-relative my-4">
                        <DashboardTabSelector activeTab={activeTab} onTabChange={setActiveTab} />

                        <div
                            className="d-flex align-items-center gap-3 position-absolute"
                            style={{
                                right: 0,
                                top: 5,
                            }}
                        >
                            <DateFilter
                                startDate={startDate}
                                endDate={endDate}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                            />
                            <GraphTypeToggle type={graphType} onChange={setGraphType} />
                        </div>

                    </div>
                    {graphType === "bar" ? (
                        <Bar data={chartData} options={chartOptions} />
                    ) : (
                        <Line data={lineData} options={lineOptions} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHorChart;
