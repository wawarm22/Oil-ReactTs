import React, { useState } from "react";
import { mockData } from "../../types/submissionData";
import Button from "../reusable/Button";
import { TbEdit } from "react-icons/tb";
import { MdOpenInNew } from "react-icons/md";
import '../../assets/css/table.css';
import '../../assets/css/icon.css';
import { getStatusColor } from "../../utils/function/getStatusColor";
import Pagination from "../reusable/Pagination";
import { useNavigate } from "react-router-dom";

const FormSubmission: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(mockData.length / itemsPerPage);
  const currentData = mockData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleBack = () => {
    navigate('/');
  }

  const handleUploadForm = () => {
    navigate("/pre-upload");
  };

  return (
    <div className="container-fluid w-100 mt-3" style={{ maxWidth: "1800px" }}>
      <div className="d-flex justify-content-between align-items-end">
        <p        
          className="fw-bold mb-0"
          style={{
            fontFamily: "IBM Plex Sans Thai",
            fontSize: "32px",
            // lineHeight: "1",            
          }}
        >
          รายการลดหย่อนและการคืนภาษีน้ำมัน
        </p>
        <Button
          type="button"
          label="ยื่นแบบ"
          bgColor="#4FA9FF"
          color="#FFF"
          maxWidth="130px"
          hoverBgColor="#FFFF"
          hoverBorderColor="#4FA9FF"
          hoverColor="#4FA9FF"
          variant="bg-hide"
          onClick={handleUploadForm}
        />
      </div>
      <div className="table-responsive bg-white p-4 mt-3 rounded shadow rounded-3" style={{ fontSize: '16spx' }}>
        <table className="table custom-table table-borderless fw-bold">
          <thead style={{ borderBottom: "2px solid #0000004B" }}>
            <tr>
              <th>ลำดับ</th>
              <th>เลขที่คำขอ</th>
              <th>วันที่ยื่นแบบ</th>
              <th>ปริมาณหรือจำนวน</th>
              <th>รายละเอียด</th>
              <th>สถานะ</th>
              <th className="text-center">แก้ไข</th>
              <th className="text-center">รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => (
              <tr key={item.id} style={{ borderBottom: "2px solid #0000004B" }}>
                <td className="align-middle">{item.id}</td>
                <td className="align-middle">{item.requestNumber}</td>
                <td className="align-middle">{item.submissionDate}</td>
                <td className="align-middle">{item.volume}</td>
                <td className="align-middle">{item.details}</td>
                <td className="align-middle">
                  <span
                    className="me-2 rounded-circle"
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: getStatusColor(item.status),
                      display: "inline-block"
                    }}
                  ></span>
                  <span>{item.status}</span>
                </td>
                <td className="align-middle text-center">
                  <TbEdit size={30} className="edit-icon" />
                </td>
                <td className="align-middle text-center">
                  <MdOpenInNew size={30} className="edit-icon" />
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

export default FormSubmission;
