import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; // Correct import for named export

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [expirationTime, setExpirationTime] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const handleTokenRefresh = useCallback(async (refreshToken) => {
        if (!refreshToken) {
            setIsAuthenticated(false);
            navigate('/login');
            return;
        }
        try {
            const response = await fetch('https://api.escuelajs.co/api/v1/auth/refresh', {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jwttoken', data.access_token);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                toast.warning("Failed to fetch the refresh token");
                navigate('/login');
            }
        } catch (error) {
            console.error("Error Message is: ", error);
            toast.error(error.message);
            setIsAuthenticated(false);
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('jwttoken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (token && typeof token === 'string') {
            try {
                const { exp } = jwtDecode(token);
                const expTime = new Date(exp * 1000).toLocaleString(); // Convert to human-readable time
                setExpirationTime(expTime); // Store the human-readable expiration time
                console.log("Expiration Time:", expTime);

                if (exp * 1000 < Date.now()) {
                    handleTokenRefresh(refreshToken);
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                setIsAuthenticated(false);
                navigate('/login');
            }
        } else if (location.pathname === "/register") {
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(false);
            navigate('/login');
        }
    }, [location.pathname, navigate, handleTokenRefresh]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleTokenRefresh, expirationTime }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
