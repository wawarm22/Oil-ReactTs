import React from 'react';
import { useLocation } from 'react-router-dom';
import '../../assets/css/background.css';
import Header from '../component/Header';
import AuthProvider from 'react-auth-kit'
import { store } from '../../hook/auth/store';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const shouldShowHeader = !(['/login', '/register', '/forgot-password', '/reset-password', '/pdf-preview'].includes(location.pathname));
    const layoutClass = !['/', '/login', '/register', '/forgot-password', '/reset-password'].includes(location.pathname) ? "bg-light-gray" : "";
    const configHeight = ['/'].includes(location.pathname) ? "h-auto" : "h-100";

    return (
        <AuthProvider store={store}>
            <div className="d-flex" style={{ minHeight: '100vh', fontFamily: 'Sarabun' }}>
                <div className="flex-grow-1">
                    {shouldShowHeader && <Header />}
                    <main className={`${layoutClass} ${configHeight}`} style={{ flexGrow: 1, overflowY: 'auto' }}>
                        {children}
                    </main>
                </div>
            </div>
        </AuthProvider>
    );
};

export default Layout;
