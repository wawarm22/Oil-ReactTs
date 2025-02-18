import React, { useState } from "react";
import Button from "../reusable/Button";
import '../../assets/css/table.css'
import Pagination from "../reusable/Pagination";
import { useNavigate } from "react-router-dom";
import { documents } from "../../types/documentData";
import { RiFileDownloadLine } from "react-icons/ri";

const DocumentList: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(documents.length / itemsPerPage);
    const currentData = documents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleBack = () => {
        navigate('/');
    }

    return (
        <div className="container w-100 mt-3" style={{ maxWidth: "1800px" }}>
            <div className="d-flex justify-content-start align-items-end">
                <p
                    className="fw-bold mb-0"
                    style={{
                        fontFamily: "IBM Plex Sans Thai",
                        fontSize: "32px",
                        lineHeight: "1",
                    }}
                >
                    ดาวน์โหลดเอกสาร
                </p>
            </div>
            <div className="table-responsive bg-white p-4 mt-2 rounded shadow rounded-3" style={{ fontSize: '16px' }}>
                <table className="table custom-table table-borderless fw-bold">
                    <thead style={{ borderBottom: "2px solid #0000004B" }}>
                        <tr>
                            <th>รายการเอกสาร</th>
                            <th>รายละเอียดเอกสาร</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item) => (
                            <tr key={item.id} style={{ borderBottom: "2px solid #0000004B" }}>
                                <td className="align-middle">{item.id}</td>
                                <td className="align-middle">{item.title} {item.description}</td>
                                <td className="align-middle text-end" style={{ width: '280px' }}>
                                    <Button
                                        type="button"
                                        label="ดาวน์โหลดเอกสาร"
                                        bgColor="#3D4957"
                                        color="#FFF"
                                        maxWidth="250px"
                                        hoverBgColor="#FFFF"
                                        hoverBorderColor="#3D4957"
                                        hoverColor="#3D4957"
                                        variant="bg-hide"
                                    >
                                        <RiFileDownloadLine className="me-1" size={20} /> {/* ✅ ไอคอนอยู่ขวา */}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage} />
                <div className="d-flex justify-content-center mt-4">
                    <Button
                        type="button"
                        label="ย้อนกลับ"
                        onClick={handleBack}
                        bgColor="#717171"
                        color="#FFF"
                        hoverBgColor="#FFFF"
                        hoverBorderColor="#717171"
                        hoverColor="#717171"
                        variant="bg-hide"
                    />
                </div>
            </div>
        </div>
    );
};

export default DocumentList;
