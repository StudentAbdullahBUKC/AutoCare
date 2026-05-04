import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
// Import your local register background
import registerBgImg from '../assets/register background.jpg'; 

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
    const [submitting, setSubmitting] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const newUser = await register(formData.name, formData.email, formData.password, formData.role);
            if (newUser.role === 'admin') navigate('/admin');
            else navigate('/customer');
        } catch (err) {
            alert('Registration failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page-wrapper" style={{ backgroundImage: `url(${registerBgImg})` }}>
            <div className="auth-card">
                <div className="page-header text-center">
                    <h2 className="page-title" style={{color: '#0f172a'}}>Join AutoCare</h2>
                    <p style={{color: '#475569', fontSize: '0.875rem'}}>Start booking professional services</p>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={onChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={onChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={onChange} className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Register As</label>
                        <select name="role" value={formData.role} onChange={onChange} className="form-control">
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-hero-primary" style={{width: '100%', marginTop: '1rem'}} disabled={submitting}>
                        {submitting ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <p className="text-center mt-4" style={{fontSize: '0.875rem'}}>
                    Already registered? <Link to="/login" style={{color: '#1e40af', fontWeight: '700'}}>Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;