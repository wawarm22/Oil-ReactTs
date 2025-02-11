import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const shouldShowHeader = !(['/login', '/register'].includes(location.pathname));

    return (
        <div className="d-flex" style={{ minHeight: '100vh', fontFamily: 'Sarabun' }}>
            <div className="flex-grow-1">
                {shouldShowHeader && <Header />}
                <main style={{ flexGrow: 1, height: "100%", overflowY: 'auto' }}>{children}</main>
            </div>
        </div>
    );
};

export default Layout;
