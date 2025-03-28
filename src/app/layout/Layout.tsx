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
    const layoutClass = !['/','/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname) ? "bg-light-gray" : "";
    const configHeight = ['/'].includes(location.pathname) ? "h-auto" : "h-100";

    return (
        <div className="d-flex" style={{ minHeight: '100vh', fontFamily: 'Sarabun' }}>
            <div className="flex-grow-1">
                {shouldShowHeader && <Header />}
                <main className={`${layoutClass} ${configHeight}`} style={{ flexGrow: 1, overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
