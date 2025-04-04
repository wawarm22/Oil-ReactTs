import React, { useEffect } from 'react'
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { useNavigate } from 'react-router-dom';

const AuthRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
    const isAuthenticate = useIsAuthenticated();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticate) {
            navigate("/login", {
                replace: true,
            })
        }
    }, [isAuthenticate])
    return (
        <>{children}</>
    )
}

export default AuthRoute