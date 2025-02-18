import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { FaFileAlt, FaFileInvoiceDollar, FaSearchDollar, FaCheck } from "react-icons/fa";

const Dashboard: React.FC = () => {
    const pieData = {
        labels: ["กำลังตรวจสอบ", "ต้องชำระเพิ่ม", "คืนภาษีสำเร็จ"],
        datasets: [
            {
                data: [10, 10, 25], 
                backgroundColor: ["#4D97FD", "#FF7952", "#5AD87F"],
            },
        ],
    };

    const pieOptions = {
        plugins: {
            legend: {
                display: false, 
            },
        },
    };

    return (
        <div className="container-fluid w-100 d-flex justify-content-center">
            <div
                className="card p-4 shadow"
                style={{
                    maxWidth: "1800px",
                    width: "100%",
                    borderRadius: "12px",
                }}
            >
                {/* 🔹 Wrapper สำหรับกำหนดขนาดภายใน */}
                <div className="container-fluid" style={{ maxWidth: "1400px" }}>

                    {/* 🔹 หัวข้อให้อยู่แยกบรรทัด */}
                    <div className="text-start fw-bold mb-4">
                        <p style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px" }}>รายการขอลดหย่อนและการคืนภาษีน้ำมันทั้งหมด</p>
                    </div>

                    {/* 🔹 คอนเทนต์ (แบ่งเป็น 2 คอลัมน์) */}
                    <div className="row mt-2">
                        {/* กราฟ Pie Chart */}
                        <div className="col-md-6 d-flex justify-content-start p-0">
                            <div style={{ width: "300px", height: "300px" }}>
                                <Pie data={pieData} options={pieOptions} />
                            </div>
                        </div>

                        {/* 🔹 รายการข้อมูล จัดเป็น Grid 2x2 */}
                        <div className="col-md-6 p-0">
                            <div className="row">
                                {/* Card 1 */}
                                <div className="col-md-6">
                                    <div className="card border-0 d-flex flex-column align-items-start" style={{ maxWidth: '150px' }}>
                                        <FaFileAlt size={40} className="mb-3" style={{ color: '#FFD85C' }} />
                                        <strong className="text-start">คำขอลดหย่อนและการคืนภาษีที่ยื่น</strong>
                                        <p className="fw-bold mb-0">
                                            <span style={{ fontSize: '32px' }}>45</span>
                                            <span style={{ fontSize: '20px' }}> ชุด</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="col-md-6 mb-4">
                                    <div className="card border-0 d-flex flex-column align-items-start" style={{ maxWidth: '130px' }}>
                                        <FaSearchDollar size={40} className="mb-3" style={{ color: '#4D97FE' }} />
                                        <strong className="text-start">คำขอลดหย่อนที่รอการตรวจสอบ</strong>
                                        <p className="fw-bold mb-0">
                                            <span style={{ fontSize: '32px' }}>10</span>
                                            <span style={{ fontSize: '20px' }}> ชุด</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="col-md-6">
                                    <div className="card border-0 d-flex flex-column align-items-start" style={{ maxWidth: '130px' }}>
                                        <FaFileInvoiceDollar size={40} className="mb-3" style={{ color: '#FF7952' }} />
                                        <strong className="text-start">คำขอลดหย่อนภาษีที่ต้องชำระเพิ่ม</strong>
                                        <p className="fw-bold mb-0">
                                            <span style={{ fontSize: '32px' }}>10</span>
                                            <span style={{ fontSize: '20px' }}> ชุด</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Card 4 */}
                                <div className="col-md-6" style={{ maxWidth: '180px' }}>
                                    <div className="card border-0 d-flex flex-column align-items-start" style={{ maxWidth: '100px' }}>
                                        <FaCheck size={40} className="mb-3" style={{ color: '#5AD87F' }} />
                                        <strong className="text-start">คำขอลดหย่อนภาษีที่ได้คืน</strong>
                                        <p className="fw-bold mb-0">
                                            <span style={{ fontSize: '32px' }}>25</span>
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

export default Dashboard;
