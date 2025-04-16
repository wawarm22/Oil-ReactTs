import React, { useState } from "react";
import '../../assets/css/underline-hover.css'
import '../../assets/css/input-highlights.css'
import { MdLockReset } from "react-icons/md";
import bgImage from "../../assets/img/bg-login.png";
import sidebar from "../../assets/img/line-sidebar.png";
import logo from "../../assets/img/excise-logo.png";
import imgForm from "../../assets/img/img-form-login.png";
import topCorner from "../../assets/img/top-corner.png";
import bCorner from "../../assets/img/b-corner.png";
import lineTop from "../../assets/img/line-top.png";
import Button from "../reusable/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { apiResetPassword } from "../../utils/api/authenApi";
import { toast } from "react-toastify";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";
import { Spinner } from "react-bootstrap";

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const token = queryParams.get("token");

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("ลิงก์ไม่ถูกต้องหรือหมดอายุ");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error("รหัสผ่านไม่ตรงกัน");
            return;
        }

        setIsLoading(true);
        try {
            await apiResetPassword(token, newPassword);
            toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
            navigate("/login");
        } catch (error) {
            toast.error("ไม่สามารถเปลี่ยนรหัสผ่านได้");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex vh-100 w-100" style={{ fontFamily: 'IBM Plex Sans Thai' }}>
            <div className="d-flex flex-column align-items-center justify-content-center bg-dark vh-100" style={{ width: "60px" }}>
                <img src={logo} alt="Logo" className="mb-3" style={{ width: "40px" }} />
                <img src={sidebar} alt="Sidebar Lines" className="img-fluid" style={{ height: "90%", width: "3px" }} />
            </div>

            <div className="container-fluid vh-100">
                <div className="row h-100">
                    <div className="col-lg-6 col-12 position-relative p-0">
                        <div
                            className="w-100 h-100"
                            style={{
                                background: `url(${bgImage}) center / cover`,
                            }}
                        ></div>
                        <img
                            src={topCorner}
                            alt="Top Corner"
                            className="position-absolute top-0 end-0 d-none d-lg-block"
                            style={{ width: '43%', objectFit: 'cover' }}
                        />
                        <div className="position-absolute bottom-0 start-0 w-100">
                            <img
                                src={bCorner}
                                alt="Bottom Corner"
                                className="w-100"
                                style={{ objectFit: 'cover', maxWidth: '60%' }}
                            />
                            <p className="fw-bold text-white text-start position-absolute translate-middle"
                                style={{
                                    fontSize: "2vw",
                                    fontFamily: 'IBM Plex Sans Thai',
                                    zIndex: "10",
                                    width: "80%",
                                    top: "59%",
                                    left: "44%",
                                    transform: "translate(-50%, -50%)"
                                }}
                            >
                                <span className="d-block">ระบบขอลดหย่อน</span>
                                <span className="d-block">และการคืนภาษีน้ำมัน</span>
                            </p>
                        </div>
                    </div>

                    <div className="col-lg-6 col-12 d-flex align-items-center justify-content-center bg-dark"
                        style={{
                            background: `url(${imgForm}) no-repeat center center / contain`,
                            backgroundPosition: "top right"
                        }}
                    >
                        <div className="p-4 bg-black text-white d-flex flex-column justify-content-center align-items-center"
                            style={{
                                width: "100%",
                                maxWidth: "550px",
                                height: "650px",
                                borderRadius: "195px"
                            }}
                        >
                            <div className="position-relative" style={{ width: '300px' }}>
                                <div>
                                    <MdLockReset className="mb-3 me-2" size={45} />
                                    <span className="fw-bold" style={{ fontSize: '32px' }}>รีเซ็ตรหัสผ่าน</span>
                                </div>
                                <img className="img-fluid ps-1 mb-3" src={lineTop} alt="Line Top" style={{ width: "99%" }} />
                                <form className="mt-2" onSubmit={handleResetPassword}>
                                    <div className="d-flex justify-content-center position-relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="รหัสผ่านใหม่"
                                            className="w-100 p-3 border rounded-2 mb-3"
                                            style={{ maxHeight: "38px" }}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <span
                                            onClick={() => setShowNewPassword(prev => !prev)}
                                            className="position-absolute end-0 translate-middle-y me-2"
                                            style={{ cursor: "pointer", top: '19px' }}
                                        >
                                            {showNewPassword ? (
                                                <IoEyeOffSharp size={30} color="black" />
                                            ) : (
                                                <IoEyeSharp size={30} color="black" />
                                            )}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-center position-relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="ยืนยันรหัสผ่านใหม่"
                                            className="w-100 p-3 border rounded-2 mb-4"
                                            style={{ maxHeight: "38px" }}
                                            value={confirmNewPassword}
                                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        />
                                        <span
                                            onClick={() => setShowConfirmPassword(prev => !prev)}
                                            className="position-absolute end-0 translate-middle-y me-2"
                                            style={{ cursor: "pointer", top: '19px' }}
                                        >
                                            {showConfirmPassword ? (
                                                <IoEyeOffSharp size={30} color="black" />
                                            ) : (
                                                <IoEyeSharp size={30} color="black" />
                                            )}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-center gap-2">
                                        <Button
                                            type="button"
                                            label="ยกเลิก"
                                            bgColor="#717171"
                                            color="#FFF"
                                            hoverBgColor="#FFFF"
                                            maxWidth="150px"
                                            variant="bg-hide"
                                            onClick={() => navigate('/login')}
                                        />
                                        <Button
                                            type="submit"
                                            label="ยืนยัน"
                                            bgColor="#FFCB02"
                                            color="#000"
                                            maxWidth="150px"
                                            variant="bg-hide"
                                            disabled={isLoading}
                                        >
                                            {isLoading && (
                                                <Spinner animation="border" size="sm" className="me-1"/>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default ResetPassword;