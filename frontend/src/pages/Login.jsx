import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// Import your local login background image[cite: 1]
import loginBgImg from '../assets/login background.jpg'; 

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const loggedInUser = await login(formData.email, formData.password);
            // Navigate directly based on the user's role[cite: 2]
            if (loggedInUser.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/customer');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Invalid credentials. Please try again.';
            alert(errorMsg);
            console.error('Login error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div 
            className="auth-page-wrapper" 
            style={{ 
                backgroundImage: `url(${loginBgImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
                width: '100%'
            }}
        >
            <div className="auth-card">
                <div className="page-header text-center" style={{ marginBottom: '1.5rem', paddingBottom: '1rem' }}>
                    <h2 className="page-title" style={{ color: '#0f172a' }}>Welcome Back</h2>
                    <p style={{ color: '#475569', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        Sign in to manage your appointments
                    </p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label" style={{ color: '#1e293b' }}>Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={onChange} 
                            className="form-control" 
                            placeholder="you@example.com" 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" style={{ color: '#1e293b' }}>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={onChange} 
                            className="form-control" 
                            placeholder="••••••••" 
                            required 
                        />
                    </div>
                    
                    {/* Reusing the frosted glass button style[cite: 2] */}
                    <button 
                        type="submit" 
                        className="btn btn-hero-primary" 
                        style={{ width: '100%', marginTop: '1rem' }} 
                        disabled={submitting}
                    >
                        {submitting ? 'Signing in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center mt-4" style={{ color: '#475569', fontSize: '0.875rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#1e40af', fontWeight: '700' }}>Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;