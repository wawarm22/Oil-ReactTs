import React from "react";
import StepProgress from "../reusable/StepProgress";
import Button from "../reusable/Button";
import '../../assets/css/table.css'
import { useNavigate } from "react-router-dom";
import { documentList } from "../../types/docList";
import { RiFileDownloadLine } from "react-icons/ri";

const Upload: React.FC = () => {
    const navigate = useNavigate();
    // const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 5;
    // const totalPages = Math.ceil(documentList.length / itemsPerPage);
    // const currentData = documentList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleBack = () => {
        navigate('/');
    }
    return (
        <div className="container-fluid mt-4 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                รายการลดหย่อนเเละการคืนภาษี
            </p>
            <StepProgress />
            {/* เพิ่ม UI สำหรับอัปโหลดเอกสาร */}
            <div className="mt-3 d-flex justify-content-between align-items-end">
                <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                    ยื่นแบบเอกสาร
                </p>
            </div>
            <div className="table-responsive bg-white p-4 rounded shadow-sm rounded-3" style={{ fontSize: '16spx' }}>
                <table className="table custom-table table-borderless fw-bold">
                    <thead style={{ borderBottom: "2px solid #0000004B" }}>
                        <tr>
                            <th className="align-middle" style={{fontSize: '22px'}}>รายการเอกสาร</th>
                            <th className="align-middle text-center" style={{fontSize: '22px'}}>จำนวนหน้า</th>
                            <th className="text-end">
                                <Button
                                    className="w-100"
                                    type="button"
                                    label="อัปโหลดเอกสารหลายชนิด"
                                    bgColor="#4FA9FF"
                                    color="#FFFF"
                                    maxWidth="260px"
                                    hoverBgColor="#FFFF"
                                    hoverBorderColor="#4FA9FF"
                                    hoverColor="#4FA9FF"
                                    variant="bg-hide"
                                >
                                    <RiFileDownloadLine className="me-1" size={25} />
                                </Button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {documentList.map((item) => (
                            <tr key={item.id} style={{ borderBottom: "2px solid #0000004B" }}>
                                <td className="align-middle">{item.id}. {item.title}</td>
                                <td className="text-center align-middle">{item.pages} หน้า</td>
                                <td className="text-end">
                                    <Button
                                        className="w-100"
                                        type="button"
                                        label="ดูเอกสาร"
                                        bgColor="#9D9D9D"
                                        color="#FFFFFF"
                                        maxWidth="150px"
                                        hoverBgColor="#FFFFFF"
                                        hoverBorderColor="#9D9D9D"
                                        hoverColor="#9D9D9D"
                                        variant="bg-hide"
                                    />
                                    <Button
                                        className="ms-3 w-100"
                                        type="button"
                                        label="อัปโหลดเอกสาร"
                                        bgColor="#3D4957"
                                        color="#FFFF"
                                        maxWidth="260px"
                                        hoverBgColor="#FFFF"
                                        hoverBorderColor="#3D4957"
                                        hoverColor="#3D4957"
                                        variant="bg-hide"
                                    >
                                        <RiFileDownloadLine className="me-1" size={25} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage} /> */}
                <div className="d-flex justify-content-center mt-4">
                    <Button
                        className="me-3"
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
                    <Button
                        type="button"
                        label="ยืนยันการอัปโหลด"
                        bgColor="#FFCB02"
                        color="#1E2329"
                        hoverBgColor="#FFFF"
                        hoverBorderColor="#FFCB02"
                        hoverColor="#FFCB02"
                        variant="bg-hide"
                    />
                </div>
            </div>
        </div>
    );
};

export default Upload;
