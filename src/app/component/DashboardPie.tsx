import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../../assets/css/line-dashboard.css"
import { FaFileAlt, FaFileInvoiceDollar, FaSearchDollar, FaCheck } from "react-icons/fa";
import { pieData, pieOptions } from "../../utils/chartData";
import DateFilter from "../reusable/DateFilter";

const DashboardPie: React.FC = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    return (
        <div className="container-fluid w-100 d-flex justify-content-center">
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

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className="fw-bold" style={{ fontSize: "32px" }}>รายการขอลดหย่อนและการคืนภาษีน้ำมันทั้งหมด</p>

                        <DateFilter
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 d-flex justify-content-center align-items-center p-0">
                            <div style={{ width: "300px", height: "300px" }}>
                                <Pie data={pieData} options={pieOptions} />
                            </div>
                        </div>

                        <div className="col-md-6 p-0">
                            <div className="row">
                                <div className="col-md-6 mb-4 d-flex align-items-center">
                                    <div className="custom-line" style={{ "--line-color": "#FFD85C" } as React.CSSProperties}></div>  {/* ✅ เส้นอยู่ด้านซ้าย */}
                                    <div className="card border-0 d-flex flex-column align-items-start ms-3" style={{ maxWidth: '140px' }}>
                                        <FaFileAlt size={40} className="mb-3" style={{ color: '#FFD85C' }} />
                                        <strong className="text-start">คำขอลดหย่อนและการคืนภาษีที่ยื่น</strong>
                                        <p className="fw-bold mb-0">
                                            <span
                                                className="underline-custom"
                                                style={{ fontSize: '36px' }}>
                                                0
                                            </span>
                                            <span style={{ fontSize: '20px' }}> ชุด</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="col-md-6 mb-4 d-flex align-items-center">
                                    <div className="custom-line" ></div>
                                    <div className="card border-0 d-flex flex-column align-items-start ms-3" style={{ maxWidth: '120px' }}>
                                        <FaSearchDollar size={40} className="mb-3" style={{ color: '#4D97FE' }} />
                                        <strong className="text-start">คำขอลดหย่อนที่รอการตรวจสอบ</strong>
                                        <p className="fw-bold mb-0">
                                            <span
                                                className="underline-custom"
                                                style={{ fontSize: '36px', "--underline-color": "#4D97FE" } as React.CSSProperties}>
                                                0
                                            </span>
                                            <span style={{ fontSize: '20px' }}> ชุด</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="col-md-6 d-flex align-items-center">
                                    <div className="custom-line" style={{ "--line-color": "#FF7952" } as React.CSSProperties}></div>
                                    <div className="card border-0 d-flex flex-column align-items-start ms-3" style={{ maxWidth: '130px' }}>
                                        <FaFileInvoiceDollar size={40} className="mb-3" style={{ color: '#FF7952' }} />
                                        <strong className="text-start">คำขอลดหย่อนภาษีที่ต้องชำระเพิ่ม</strong>
                                        <p className="fw-bold mb-0">
                                            <span
                                                className="underline-custom"
                                                style={{ fontSize: '36px', "--underline-color": "#FF7952" } as React.CSSProperties}>
                                                0
                                            </span>
                                            <span style={{ fontSize: '20px' }}> ชุด</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="col-md-6 d-flex align-items-center">
                                    <div className="custom-line" style={{ "--line-color": "#5AD87F" } as React.CSSProperties}></div>
                                    <div className="card border-0 d-flex flex-column align-items-start ms-3" style={{ maxWidth: '100px' }}>
                                        <FaCheck size={40} className="mb-3" style={{ color: '#5AD87F' }} />
                                        <strong className="text-start">คำขอลดหย่อนภาษีที่ได้คืน</strong>
                                        <p className="fw-bold mb-0">
                                            <span
                                                className="underline-custom"
                                                style={{ fontSize: '36px', "--underline-color": "#5AD87F" } as React.CSSProperties}>
                                                0
                                            </span>
                                            <span style={{ fontSize: '20px' }}> ชุด</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPie;
