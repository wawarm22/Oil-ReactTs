import React, { useState } from "react";
import '../../assets/css/underline-hover.css'
import '../../assets/css/input-highlights.css'
import { MdEmail, MdLockReset } from "react-icons/md";
import bgImage from "../../assets/img/bg-login.png";
import sidebar from "../../assets/img/line-sidebar.png";
import logo from "../../assets/img/excise-logo.png";
import imgForm from "../../assets/img/img-form-login.png";
import topCorner from "../../assets/img/top-corner.png";
import bCorner from "../../assets/img/b-corner.png";
import lineTop from "../../assets/img/line-top.png";
import Button from "../reusable/Button";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    return (
        <>
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
                                    <span className="d-block">เเละการคืนภาษีน้ำมัน</span>
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
                                        <span className="fw-bold" style={{ fontSize: '32px' }}>ลืมรหัสผ่าน</span>
                                    </div>
                                    <img className="img-fluid ps-1 mb-3" src={lineTop} alt="Line Top" style={{ width: "99%" }} />
                                    <form className="mt-2">
                                        <div className="input-group">
                                            <span className="input-group-text bg-white border-0 rounded-start-3">
                                                <MdEmail size={20} />
                                            </span>
                                            <input
                                                type="text"
                                                className="form-control bg-white border-0 ps-0 rounded-end-3"
                                                placeholder="อีเมล"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button
                                            className="mt-5 w-100"
                                            type="button"
                                            label="ส่งลิงค์สำหรับเปลี่ยนรหัสผ่าน"
                                            maxWidth="300px"
                                            bgColor="#FFCB02"
                                            color="#131516"
                                            variant="bg-hide"
                                        />
                                        <Button
                                            className="mt-3 w-100"
                                            type="button"
                                            label="ย้อนกลับ"
                                            maxWidth="300px"
                                            bgColor="#717171"
                                            color="#FFF"
                                            hoverBgColor="#FFFF"
                                            variant="bg-hide"
                                            onClick={() => navigate('/login')}
                                        />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;
