import React, { useState } from "react";
import StepProgress from "../reusable/StepProgress";
import Button from "../reusable/Button";
import "../../assets/css/dropdown-icon.css";
import "../../assets/css/dropdown-animation.css";
import "../../assets/css/table.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StepStatus } from "../../types/enum/stepStatus";
import { matchTableList } from "../../types/matchTableList";

const MatchList: React.FC = () => {
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState<{ [key: number]: boolean }>({});
    const [isAnimating, setIsAnimating] = useState<{ [key: number]: boolean }>({});
    const [searchParams] = useSearchParams();
    const from = searchParams.get('from');

    const handleBack = () => {
        if (from === "search-file") {
            navigate(`/match-document?from=${from}`);
        } else {
            navigate('/match-document');
        }
    }

    const toggleDropdown = (docId: number) => {
        setOpenDropdown(prev => ({ ...prev, [docId]: !prev[docId] }));
        if (openDropdown[docId]) {
            setIsAnimating(prev => ({ ...prev, [docId]: true }));
            setTimeout(() => setIsAnimating(prev => ({ ...prev, [docId]: false })), 300);
        }
    };

    return (
        <div className="container-fluid mt-3 w-100" style={{ maxWidth: '1800px' }}>
            <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                ขั้นตอนการดำเนินงาน
            </p>
            <StepProgress status={StepStatus.MATCH} />
            <div className="mt-3 d-flex justify-content-between align-items-end">
                <p className="fw-bold mb-0" style={{ fontFamily: "IBM Plex Sans Thai", fontSize: "32px", }}>
                    รายการการตรวจสอบภาษี
                </p>
            </div>
            <div className="table-responsive bg-white p-4 rounded shadow-sm rounded-3" style={{ fontSize: '16spx' }}>
                <table className="table custom-table table-borderless fw-bold">
                    <thead style={{ borderBottom: "3px solid #0000004B" }}>
                        <tr>
                            <th className="align-middle" style={{ fontSize: '22px' }}>รายการเอกสาร</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matchTableList.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr style={{ borderBottom: openDropdown[item.id] || isAnimating[item.id] ? "none" : "3px solid #0000004B" }}>
                                    <td className="align-middle">
                                        <span
                                            className="fw-bold"
                                            style={{ cursor: "pointer", verticalAlign: "middle" }}
                                            onClick={() => toggleDropdown(item.id)}
                                        >
                                            <span
                                                className="me-2"
                                                style={{
                                                    display: "inline-block",
                                                    width: "3px",
                                                    height: "28px",
                                                    backgroundColor: "#9D9D9D",
                                                    borderRadius: "2px",
                                                    verticalAlign: "middle"
                                                }}></span>

                                            {item.id}. {item.title}
                                        </span>

                                    </td>
                                    <td className="text-end w-50">
                                        {/* <Button
                                            className="w-100"
                                            type="button"
                                            label="ดูเอกสาร"
                                            bgColor="#3D4957"
                                            color="#FFFFFF"
                                            maxWidth="150px"
                                            variant="bg-hide"
                                            disabled
                                        /> */}
                                        <Button
                                            className="ms-3 w-100"
                                            type="button"
                                            label="ผ่านการตรวจสอบเอกสาร"
                                            bgColor="#22C659"
                                            color="#FFFFFF"
                                            maxWidth="260px"
                                            variant="bg-hide"
                                        // disabled
                                        />
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <div className="d-flex justify-content-center mt-4">
                    <Button
                        className="me-3"
                        type="button"
                        label="ย้อนกลับ"
                        onClick={handleBack}
                        bgColor="#717171"
                        variant="bg-hide"
                    />
                    <Button
                        type="button"
                        label="ยืนยันรายการ"
                        bgColor="#FFCB02"
                        color="#1E2329"
                        variant="bg-hide"
                    />
                </div>
            </div>
        </div>
    );
};

export default MatchList;
