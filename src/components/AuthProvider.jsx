import axios from 'axios';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import React, { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Logout function
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common.Authorization;
        navigate('/login', { replace: true });
    }, [navigate]);

    // Validate token and load user info on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            axios
                .post('http://localhost:8080/auth/validate', { token: storedToken })
                .then((res) => {
                    if (res.data.valid) {
                        setUser({
                            username: res.data.username,
                            role: res.data.role,
                            clinicIds: res.data.clinicIds,
                        });
                        setToken(storedToken);
                        axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
                    } else {
                        handleLogout();
                    }
                })
                .catch(() => {
                    handleLogout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [handleLogout]);

    // Login function
    const handleLogin = useCallback(
        async (username, password) => {
            setLoading(true);
            try {
                const res = await axios.post('http://localhost:8080/auth/login', {
                    username,
                    password,
                });
                const receivedToken = res.data.token;
                localStorage.setItem('token', receivedToken);
                axios.defaults.headers.common.Authorization = `Bearer ${receivedToken}`;
                // Validate token and get user info
                const validationRes = await axios.post('http://localhost:8080/auth/validate', {
                    token: receivedToken,
                });
                if (validationRes.data.valid) {
                    setUser({
                        username: validationRes.data.username,
                        role: validationRes.data.role,
                        clinicIds: validationRes.data.clinicIds,
                    });
                    setToken(receivedToken);
                    localStorage.setItem(
                        'userInfo',
                        JSON.stringify({
                            username: validationRes.data.username,
                            role: validationRes.data.role,
                            clinicIds: validationRes.data.clinicIds,
                        })
                    );
                    return { success: true };
                }
                handleLogout();
                return { success: false, message: 'Token validation failed' };
            } catch (err) {
                handleLogout();
                return {
                    success: false,
                    message: err.response?.data?.message || 'Invalid username or password',
                };
            } finally {
                setLoading(false);
            }
        },
        [handleLogout]
    );

    // Axios interceptor for 401 (session expiration)
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    handleLogout();
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, [handleLogout]);

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: !!user && !!token,
            loading,
            login: handleLogin,
            logout: handleLogout,
        }),
        [user, token, loading, handleLogin, handleLogout]
    );

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export function useAuth() {
    return useContext(AuthContext);
}
