import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
// Import your local admin background[cite: 1]
import adminBg from '../assets/admin background.jpg';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [newService, setNewService] = useState({ name: '', description: '', price: '', duration: '' });
    const [message, setMessage] = useState({ text: '', type: '' });
    const [addingService, setAddingService] = useState(false);

    const fetchAdminData = async () => {
        try {
            const [servicesRes, appointmentsRes] = await Promise.all([
                axios.get('/services'),
                axios.get('/appointments')
            ]);
            setServices(servicesRes.data);
            setAppointments(appointmentsRes.data);
        } catch (err) {
            console.error('Error fetching admin data', err);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleAddService = async (e) => {
        e.preventDefault();
        setAddingService(true);
        setMessage({ text: '', type: '' });
        try {
            await axios.post('/services', {
                name: newService.name,
                description: newService.description,
                price: Number(newService.price),
                duration: Number(newService.duration)
            });
            setNewService({ name: '', description: '', price: '', duration: '' });
            setMessage({ text: 'Service added successfully!', type: 'success' });
            fetchAdminData();
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Error adding service.';
            setMessage({ text: errorMsg, type: 'error' });
        } finally {
            setAddingService(false);
        }
    };

    const handleDeleteService = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await axios.delete(`/services/${id}`);
            setMessage({ text: `Service "${name}" deleted.`, type: 'success' });
            fetchAdminData();
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Error deleting service.';
            setMessage({ text: errorMsg, type: 'error' });
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`/appointments/${id}/status`, { status });
            fetchAdminData();
        } catch (err) {
            alert('Error updating appointment status.');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'confirmed': return 'badge-info';
            case 'completed': return 'badge-success';
            case 'cancelled': return 'badge-danger';
            case 'pending':
            default: return 'badge-warning';
        }
    };

    return (
        <div 
            style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${adminBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
                padding: '2rem 0'
            }}
        >
            <div className="container">
                <div className="page-header" style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '2rem' }}>
                    <h2 className="page-title" style={{ color: '#fff' }}>Admin Dashboard</h2>
                    <p style={{ color: '#cbd5e1' }}>System oversight and service management</p>
                </div>

                {message.text && (
                    <div style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: message.type === 'success' ? '#10b981' : '#ef4444',
                        border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                        backdropFilter: 'blur(10px)'
                    }}>
                        {message.text}
                    </div>
                )}

                {/* Row 1: Add Service + Manage Services */}
                <div className="grid grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>
                    <div className="auth-card" style={{ maxWidth: 'none' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#0f172a' }}>Add New Service</h3>
                        <form onSubmit={handleAddService}>
                            <div className="form-group">
                                <label className="form-label">Service Name</label>
                                <input type="text" className="form-control" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} rows="3" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label className="form-label">Price ($)</label>
                                    <input type="number" className="form-control" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Duration (mins)</label>
                                    <input type="number" className="form-control" value={newService.duration} onChange={e => setNewService({...newService, duration: e.target.value})} required />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-hero-primary" 
                                style={{ marginTop: '1rem', width: '100%', opacity: addingService ? 0.7 : 1 }}
                                disabled={addingService}
                            >
                                {addingService ? 'Adding...' : 'Add Service'}
                            </button>
                        </form>
                    </div>

                    <div className="auth-card" style={{ maxWidth: 'none' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#0f172a' }}>
                            Current Services ({services.length})
                        </h3>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }} className="flex flex-col gap-4">
                            {services.length === 0 ? (
                                <p style={{ color: '#64748b' }}>No services added yet. Add one using the form.</p>
                            ) : (
                                services.map(svc => (
                                    <div key={svc._id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)' }}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <strong style={{ display: 'block', color: '#1e293b' }}>{svc.name}</strong>
                                                <span style={{ fontSize: '0.85rem', color: '#475569' }}>{svc.description}</span>
                                                <div style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
                                                    <span style={{ color: '#1e40af', fontWeight: '600' }}>${svc.price}</span>
                                                    <span style={{ color: '#64748b', marginLeft: '0.75rem' }}>{svc.duration} mins</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteService(svc._id, svc.name)}
                                                style={{
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#dc2626',
                                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                                    borderRadius: '6px',
                                                    padding: '0.35rem 0.75rem',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '500',
                                                    flexShrink: 0
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Row 2: All Appointments (full width) */}
                <div className="auth-card" style={{ maxWidth: 'none' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#0f172a' }}>
                        All Appointments ({appointments.length})
                    </h3>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="flex flex-col gap-4">
                        {appointments.length === 0 ? (
                            <p style={{ color: '#64748b' }}>No appointments booked yet.</p>
                        ) : (
                            appointments.map(app => (
                                <div key={app._id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)' }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <strong style={{ display: 'block', color: '#1e293b' }}>{app.service?.name || 'Unknown Service'}</strong>
                                            <span style={{ fontSize: '0.875rem', color: '#475569' }}>Customer: {app.user?.name || 'Unknown'} ({app.user?.email || ''})</span><br />
                                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{new Date(app.date).toLocaleDateString()} @ {app.timeSlot}</span>
                                            <div style={{ marginTop: '0.35rem' }}>
                                                <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
                                            </div>
                                        </div>
                                        <select
                                            className="form-control"
                                            style={{ width: 'auto', fontSize: '0.85rem' }}
                                            value={app.status}
                                            onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;