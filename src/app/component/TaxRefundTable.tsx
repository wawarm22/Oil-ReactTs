import React, { useState } from "react";
import '../../assets/css/table.css';
import '../../assets/css/icon.css';
import Pagination from "../reusable/Pagination";
import { taxRefundHistory } from "../../types/refundTaxData";
import { FaGasPump } from "react-icons/fa";
import { getStatusTaxRefund } from "../../utils/function/getStatusColor";

const TaxRefundTable: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(taxRefundHistory.length / itemsPerPage);
    const currentData = taxRefundHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                    <p className="fw-bold mb-3" style={{ fontSize: "32px" }}>ประวัติรายการคืนภาษี</p>
                    <table className="table custom-table table-borderless fw-bold">
                        <thead style={{ borderBottom: "2px solid #0000004B" }}>
                            <tr>
                                <th></th>
                                <th className="text-center pe-3">ลำดับ</th>
                                <th>ชื่อโรงงานอุตสาหกรรม</th>
                                <th>วันที่ยื่นเเบบ</th>
                                <th>จำนวนเงินที่ขอคืนภาษี</th>
                                <th>สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item) => (
                                <tr key={item.id} style={{ borderBottom: "2px solid #0000004B" }}>
                                    <td className="align-middle">
                                        <FaGasPump size={30} />
                                    </td>
                                    <td className="align-middle text-center">{item.id}</td>
                                    <td className="align-middle">{item.factoryName}</td>
                                    <td className="align-middle">{item.submittedDate}</td>
                                    <td className="align-middle">{item.amount.toLocaleString()} บาท</td>
                                    <td className="align-middle">
                                        <span
                                            className="rounded-pill px-3 py-2 d-inline-block w-100 text-center"
                                            style={{
                                                border: `2px solid ${getStatusTaxRefund(item.status)}`,
                                                maxWidth: '250px'
                                            }}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage} />
            </div>
        </div>
    );
};

export default TaxRefundTable;
