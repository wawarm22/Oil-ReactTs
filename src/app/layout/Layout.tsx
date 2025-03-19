import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../assets/css/background.css';
import Header from '../component/Header';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const shouldShowHeader = !(['/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname));

    // ✅ ตรวจสอบ pathname เพื่อกำหนด class เฉพาะหน้า (เพิ่ม /upload)
    const layoutClass = ["/form-submission", "/upload", "/upload-multiple", "/confirm", "/audit"].includes(location.pathname) ? "bg-light-gray" : "";

    return (
        <div className="d-flex" style={{ minHeight: '100vh', fontFamily: 'Sarabun' }}>
            <div className="flex-grow-1">
                {shouldShowHeader && <Header />}
                <main className={`${layoutClass}`} style={{ flexGrow: 1, height: "100%", overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
