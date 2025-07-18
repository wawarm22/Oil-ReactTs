import React from "react";
import bgMain from "../../assets/img/img-main.png";
import Button from "../reusable/Button";
import sidebar from "../../assets/img/line-sidebar.png";
import { useNavigate } from "react-router-dom";
import DashboardPie from "../component/DashboardPie";
import DashboardHorChart from "../component/DashboardHorChart";
const Home: React.FC = () => {
    const navigate = useNavigate();    

    const handleUploadForm = () => {
        navigate("/pre-upload");
    };

    const handleSearchFile = () => {
        navigate("/search-file");
    }

    return (
        <>
            <div
                className="d-flex align-items-center justify-content-center position-relative"
                style={{
                    height: "100vh",
                    maxHeight: "260px",
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

                <div
                    className="position-absolute w-100 h-100"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: "-1",
                    }}
                ></div>

                <div className="text-center text-white position-relative w-100">
                    <p className="fw-bold" style={{ fontSize: "40px", fontFamily: 'IBM Plex Sans Thai' }}>
                        ระบบขอลดหย่อนและการคืนภาษีน้ำมัน
                    </p>
                    <Button
                        className="w-100"
                        type="button"
                        label="ภาพรวมการยื่นแบบ"
                        bgColor="#DA281C"
                        color="#FFF"
                        maxWidth="220px"
                        hoverBgColor="#FFFF"
                        hoverColor="#DA281C"
                        variant="bg-hide"
                        // onClick={handleSubmitForm}
                    />
                    <Button
                        className="w-100 ms-3"
                        type="button"
                        label="ยื่นแบบ"
                        bgColor="#FFCC01"
                        color="#1E2329"
                        maxWidth="220px"
                        hoverBgColor="#1E2329"
                        hoverColor="#FFCC01"
                        variant="bg-hide"
                        onClick={handleUploadForm}
                    />
                    <Button
                        className="w-100 ms-3"
                        type="button"
                        label="รายการอัปโหลดเอกสาร"
                        bgColor="#1E2329"
                        color="#FFFFFF"
                        hoverBgColor="#FFFFFF"
                        maxWidth="220px"
                        variant="bg-hide"
                        onClick={handleSearchFile}
                    />
                    {/* <Button
                        className="w-100 ms-3"
                        type="button"
                        label="รายการอัปโหลดเอกสาร"
                        bgColor="#DA281C"
                        color="#FFF"
                        hoverBgColor="#FFFF"
                        hoverColor="#DA281C"
                        maxWidth="220px"
                        variant="bg-hide"
                        onClick={handleSearchFile}
                    /> */}
                </div>
            </div>

            <div className="bg-light-gray py-3">
                <DashboardPie />
                <DashboardHorChart />
                {/* <VerBarChart /> */}
                {/* <TaxRefundTable /> */}
            </div>
        </>
    );
};

export default Home;
