import React, { useEffect, useRef, useState } from "react";
import '../../assets/css/berger-menu.css'
import logo from "../../assets/img/logo-header.png";
import borderMenu from "../../assets/img/border-menu.png"
import PopoverMenu from "../reusable/PopoverMenu";

const Header: React.FC = () => {
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current && !menuRef.current.contains(event.target as Node) &&
                iconRef.current && !iconRef.current.contains(event.target as Node)
            ) {
                setPopoverOpen(false); // ปิดเมนูถ้าคลิกข้างนอก
            }
        };

        if (isPopoverOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isPopoverOpen]);

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
                <div
                    ref={iconRef}
                    className="px-3 py-2 d-flex align-items-center position-relative"
                >
                    <div
                        className={`menu-icon ${isPopoverOpen ? "open" : ""}`}
                        onClick={() => setPopoverOpen(!isPopoverOpen)}
                    >
                        <span></span>
                        <span></span>
                    </div>

                    <PopoverMenu isOpen={isPopoverOpen} onClose={() => setPopoverOpen(false)} menuRef={menuRef} />
                </div>

                {/* ส่วนที่ 2: ข้อมูลสาขา (เต็มพื้นที่) */}
                <div className="flex-grow-1 bg-dark text-end text-white d-flex align-items-center justify-content-center position-relative">
                    <div>
                        <span className="d-block fw-bold">สาขา : ถนนพระราม 3</span>
                        <span className="d-block fw-bold">วันที่ 10/01/2025</span>
                    </div>
                    <img
                        src={borderMenu}
                        alt="border menu"
                        className="position-absolute top-50 translate-middle-y"
                        style={{ width: '2%', right: '10%' }}
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
