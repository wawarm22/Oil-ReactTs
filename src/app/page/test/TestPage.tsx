// import React from 'react'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthSchema } from '../../../types/schema/auth';


const TestPage = () => {
    const isAuthenticated = useIsAuthenticated()
    const auth = useAuthUser<AuthSchema>()
    const navigate = useNavigate();

    useEffect(() => {
        console.log("isAuthenticated:", isAuthenticated);
        
        if (!isAuthenticated) {
            navigate("/login")
        }
    }, [isAuthenticated])


    return (
        <div>
            [{isAuthenticated ? "true" : "false"}] Hello {auth?.accessToken}
        </div>
    )
}

export default TestPage