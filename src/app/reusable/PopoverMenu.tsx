import React from "react";
import { CSSTransition } from "react-transition-group";
import "../../assets/css/underline-hover.css"
import "../../assets/css/popover.css"

interface PopoverMenuProps {
    isOpen: boolean;
    onClose: () => void;
    menuRef: React.RefObject<HTMLDivElement>;
}

const PopoverMenu: React.FC<PopoverMenuProps> = ({ isOpen, menuRef }) => {
    return (
        <CSSTransition
            in={isOpen}
            timeout={300}
            classNames="reveal-step"
            unmountOnExit
        >
            <div
                ref={menuRef}
                className="popover-menu position-absolute bg-white shadow p-3 rounded"
                style={{
                    top: "75%",
                    right: "25%",
                    width: "220px",
                    zIndex: 1000,
                    fontFamily: "IBM Plex Sans Thai"
                }}
            >
                <ul className="list-unstyled mb-0">
                    <li className="py-2 px-3">
                        <a href="#" className="text-dark text-decoration-none fw-bold hover-underline">ประวัติการทำรายการ</a>
                    </li>
                    <li className="py-2 px-3">
                        <a href="#" className="text-dark text-decoration-none fw-bold hover-underline">ดาวน์โหลดเอกสาร</a>
                    </li>
                    <li className="py-2 px-3">
                        <a href="#" className="text-dark text-decoration-none fw-bold hover-underline">จัดการข้อมูลส่วนตัว</a>
                    </li>
                    <li className="py-2 px-3">
                        <a href="/login" className="text-danger text-decoration-none fw-bold hover-underline">ออกจากระบบ</a>
                    </li>
                </ul>
            </div>
        </CSSTransition>
    );
};

export default PopoverMenu;
