import React from "react";
import bgMain from "../../assets/img/img-main.png";
import Button from "../reusable/Button";
import sidebar from "../../assets/img/line-sidebar.png";
import { useNavigate } from "react-router-dom";
const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmitForm = () => {
        navigate("/form-submission");
    }
    
    return (
        <div
            className="d-flex align-items-center justify-content-center position-relative"
            style={{
                height: "100vh",
                maxHeight: "260px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div
                className="position-absolute top-0 start-0 d-flex flex-column bg-dark"
                style={{ width: "75px", height: "100vh" }}
            >
                <img
                    src={sidebar}
                    alt="Sidebar Lines"
                    className="position-absolute start-50 translate-middle img-fluid"
                    style={{ height: "23%", width: "4px", top: "14%" }}
                />
            </div>

            {/* พื้นหลังเบลอ & เพิ่มความทึบ */}
            <div
                className="position-absolute w-100 h-100"
                style={{
                    backgroundImage: `url(${bgMain})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: "blur(5px)",
                    zIndex: "-1",
                }}
            ></div>

            {/* เพิ่ม Layer ความทึบ */}
            <div
                className="position-absolute w-100 h-100"
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: "-1",
                }}
            ></div>

            {/* ข้อความ & ปุ่ม */}
            <div className="text-center text-white position-relative">
                <p className="fw-bold" style={{ fontSize: "40px", fontFamily: 'IBM Plex Sans Thai' }}>
                    ระบบขอลดหย่อนและการคืนภาษีน้ำมัน
                </p>
                <Button
                    className="w-100"
                    type="button"
                    label="ยื่นแบบ"
                    bgColor="#DA281C"
                    color="#FFF"
                    hoverBgColor="#FFFF"
                    hoverColor="#DA281C"
                    variant="bg-hide"
                    onClick={handleSubmitForm}
                />
            </div>
        </div>
    );
};

export default Home;
