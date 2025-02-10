import React from "react";
import '../../assets/css/underline-hover.css'
import { useNavigate } from "react-router-dom";
import bgRegister from "../../assets/img/bg-regis.png";
import lineTop from "../../assets/img/line-top.png"
import Button from "../reusable/Button";
import frameImage from "../../assets/img/boeder-right.png"
import borderLeft from "../../assets/img/border-left.png"

const Register: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("สมัครสมาชิกสำเร็จ");
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center p-5"
            style={{
                background: `url(${bgRegister}) center / cover`,
                minHeight: "100vh",
            }}
        >
            <div
                className="text-white rounded-4 p-5"
                style={{
                    width: "1600px",
                    backgroundColor: "#151513",
                }}
            >
                <div className="container-fluid" style={{ maxWidth: '900px' }}>
                    <div className="text-start mb-4" style={{ fontFamily: 'IBM Plex Sans Thai' }}>
                        <p className="fw-bold text-start ps-3" style={{ fontSize: "38px" }}>
                            ลงทะเบียนเข้าใช้งาน
                        </p>
                        <img className="img-fluid ps-3" src={lineTop} alt="Line Top" style={{ width: "60%" }} />
                    </div>
                    <form onSubmit={handleSubmit} style={{ fontFamily: 'Sarabun' }}>
                        {/* ห่อข้อมูลส่วนที่ 1 ด้วย container ที่มี position: relative */}
                        <div className="position-relative">
                            {/* ข้อมูลส่วนที่ 1 */}
                            <div className="p-3 rounded-0 mb-2 position-relative" style={{ zIndex: 1 }}>
                                <div className="row g-3 pe-2 pb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">คำนำหน้าชื่อ</label>
                                        <select className="form-select input-group">
                                            <option>เลือก...</option>
                                            <option>นาย</option>
                                            <option>นาง</option>
                                            <option>นางสาว</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ชื่อ</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">นามสกุล</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">อีเมล</label>
                                        <div className="input-regis">
                                            <input type="email" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">เบอร์โทรศัพท์</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">เลขทะเบียนสรรพสามิต</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">รหัสผ่าน</label>
                                        <div className="input-regis">
                                            <input type="password" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ยืนยันรหัสผ่าน</label>
                                        <div className="input-regis">
                                            <input type="password" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ชื่อบริษัท</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ชื่อโรงงานอุตสาหกรรม</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <img
                                className="img-fluid"
                                src={frameImage}
                                alt="Frame"
                                style={{
                                    position: 'absolute',
                                    width: '98%',
                                    height: '90%',
                                    bottom: 0,
                                    right: 0,
                                    transform: 'translateY(0%)',
                                }}
                            />
                        </div>

                        {/* ข้อมูลส่วนที่ 2 */}
                        <div className="position-relative">
                            <img
                                src={borderLeft}
                                alt="Frame for Part 2"
                                className="img-fluid"
                                style={{
                                    position: 'absolute',
                                    width: '0.5%',
                                    height: '100%',
                                    left: '-30px',
                                    top: '47%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none',
                                }}
                            />
                            <div className="p-3 rounded-0 mb-4 position-relative" style={{ zIndex: 1 }}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">สถานที่ตั้ง</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ถนน</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ตรอก/ซอย</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">หมู่ที่</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">จังหวัด</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">อำเภอ/เขต</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">ตำบล/แขวง</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">รหัสไปรษณีย์</label>
                                        <div className="input-regis">
                                            <input type="text" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ส่วนของปุ่ม */}
                        <div className="d-flex justify-content-center gap-3">
                            <Button
                                type="button"
                                label="ย้อนกลับ"
                                bgColor="#717171"
                                color="#FFF"
                                hoverBgColor="#FFFF"
                                hoverColor="#717171"
                                variant="bg-hide"
                                onClick={() => navigate('/login')}
                            />

                            <Button
                                type="submit"
                                label="ยืนยัน"
                                bgColor="#FFCB02"
                                color="#000"
                                hoverBgColor="transparent"
                                hoverColor="#FFCB02"
                                hoverBorderColor="#FFD700"
                                variant="bg-hide"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
