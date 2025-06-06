import React from "react";
import { CSSTransition } from "react-transition-group";
import "../../assets/css/underline-hover.css"
import "../../assets/css/popover.css"
import { useNavigate } from "react-router-dom";
import useSignOut from 'react-auth-kit/hooks/useSignOut';
// import { useCompanyStore } from "../../store/companyStore";

interface PopoverMenuProps {
    isOpen: boolean;
    onClose: () => void;
    menuRef: React.RefObject<HTMLDivElement>;
}

const PopoverMenu: React.FC<PopoverMenuProps> = ({ isOpen, menuRef }) => {
    const navigate = useNavigate();
    const signOut = useSignOut()

    // const resetCompanyStore = useCompanyStore((state) => state.reset);

    const handleLogout = () => {
        signOut();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login")
    };

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
                        <a href="/document-list" className="text-dark text-decoration-none fw-bold hover-underline">ดาวน์โหลดเอกสาร</a>
                    </li>
                    <li className="py-2 px-3">
                        <a href="#" className="text-dark text-decoration-none fw-bold hover-underline">จัดการข้อมูลส่วนตัว</a>
                    </li>
                    <li className="py-2 px-3">
                        <button
                            onClick={handleLogout}
                            className="text-danger text-decoration-none fw-bold hover-underline bg-transparent border-0 w-100 text-start"
                        >
                            ออกจากระบบ
                        </button>
                    </li>
                </ul>
            </div>
        </CSSTransition>
    );
};

export default PopoverMenu;
