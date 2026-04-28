import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post('/api/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            setLoading(false);
            return false;
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post('/api/auth/register', userData);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setLoading(false);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    };

    const updateProfile = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put('/api/auth/profile', userData, config);
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
            setLoading(false);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
