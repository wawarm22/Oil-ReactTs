import React from "react";
import logo from "../../assets/img/logo-header.png";
import borderMenu from "../../assets/img/border-menu.png"
import { HiMenuAlt4 } from "react-icons/hi";

const Header: React.FC = () => {
    return (
        <header className="d-flex justify-content-between align-items-center bg-white shadow-sm">
            {/* โลโก้ด้านซ้าย */}
            <div className="d-flex align-items-center p-3" style={{ fontFamily: 'IBM Plex Sans Thai' }}>
                <div>
                    <p className="fw-bold mb-0" style={{ fontSize: '30px' }}>กรมสรรพสามิต</p>
                    <p className="mb-0" style={{ fontSize: '14px' }}>THE EXCISE DEPARTMENT</p>
                </div>
                <img
                    src={logo}
                    alt="Excise Logo"
                    className="mt-3"
                    style={{ width: '11%' }}
                />
            </div>

            {/* เมนูและข้อมูลสาขา */}
            <div className="d-flex align-items-stretch" style={{ minWidth: "330px", height: "98px" }}>
                {/* ส่วนที่ 1: ไอคอนเมนู */}
                <div className="px-3 py-2 d-flex align-items-center">
                    <HiMenuAlt4 size={25} />
                </div>

                {/* ส่วนที่ 2: ข้อมูลสาขา (เต็มพื้นที่) */}
                <div className="flex-grow-1 bg-dark text-end text-white d-flex align-items-center justify-content-center position-relative">
                    <div>
                        <span className="d-block fw-bold">สาขา : ถนนพระราม 3</span>
                        <span className="d-block fw-bold">วันที่ 10/01/2025</span>
                    </div>
                    {/* รูป borderMenu */}
                    <img
                        src={borderMenu}
                        alt="border menu"
                        className="position-absolute top-50 translate-middle-y"
                        style={{ width: '2%', right: '10%' }} // ปรับขนาดให้เหมาะสม
                    />
                </div>

                {/* ส่วนที่ 3: กรอบเส้นขอบขวา (แดง-เหลือง) */}
                <div className="d-flex flex-column align-self-stretch" style={{ width: "15%" }}>
                    <div className="bg-danger flex-grow-1"></div>
                    <div className="bg-warning flex-grow-1"></div>
                </div>
            </div>
        </header>
    );
};

export default Header;
