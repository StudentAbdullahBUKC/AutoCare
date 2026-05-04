import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// Configure axios once at module load — not inside the component body
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const res = await axios.get('/auth/me');
                setUser(res.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkLoggedIn();
    }, []);

    // Returns the logged-in user object (with role) so callers can redirect
    const login = async (email, password) => {
        const res = await axios.post('/auth/login', { email, password });
        setUser(res.data.user);
        return res.data.user; // { id, name, role }
    };

    // Returns the registered user object (with role) so callers can redirect
    const register = async (name, email, password, role) => {
        const res = await axios.post('/auth/register', { name, email, password, role });
        setUser(res.data.user);
        return res.data.user; // { id, name, role }
    };

    const logout = async () => {
        await axios.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
