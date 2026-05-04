import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container flex items-center justify-between">
                <Link to="/" className="nav-brand">AutoCare</Link>
                <ul className="flex gap-4 items-center">
                    {!user ? (
                        <>
                            <li><Link to="/login" className="btn btn-outline">Login</Link></li>
                            <li><Link to="/register" className="btn btn-primary">Register</Link></li>
                        </>
                    ) : (
                        <>
                            {user.role === 'customer' && (
                                <li><Link to="/customer" className="font-medium">Dashboard</Link></li>
                            )}
                            {user.role === 'admin' && (
                                <li><Link to="/admin" className="font-medium">Admin Panel</Link></li>
                            )}
                            <li>
                                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
