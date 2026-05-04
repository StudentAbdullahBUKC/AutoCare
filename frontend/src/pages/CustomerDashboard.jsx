import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
// Import your local customer background[cite: 1]
import customerBg from '../assets/customer background.jpg';

const CustomerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [bookingForm, setBookingForm] = useState({ serviceId: '', date: '', timeSlot: '09:00 AM' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const fetchData = async () => {
        try {
            const [servicesRes, appointmentsRes] = await Promise.all([
                axios.get('/services'),
                axios.get('/appointments/history')
            ]);
            setServices(servicesRes.data);
            setAppointments(appointmentsRes.data);
            if (servicesRes.data.length > 0 && !bookingForm.serviceId) {
                setBookingForm(prev => ({ ...prev, serviceId: servicesRes.data[0]._id }));
            }
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getSelectedPrice = () => services.find(s => s._id === bookingForm.serviceId)?.price || 0;

    const handleBooking = async (e) => {
        e.preventDefault();

        // Validation
        if (!bookingForm.serviceId) {
            setMessage({ text: 'Please select a service.', type: 'error' });
            return;
        }
        if (!bookingForm.date) {
            setMessage({ text: 'Please select a date.', type: 'error' });
            return;
        }
        if (!bookingForm.timeSlot) {
            setMessage({ text: 'Please select a time slot.', type: 'error' });
            return;
        }

        setSubmitting(true);
        setMessage({ text: '', type: '' });

        try {
            // Step 1: Create the appointment
            const appointmentRes = await axios.post('/appointments', {
                serviceId: bookingForm.serviceId,
                date: bookingForm.date,
                timeSlot: bookingForm.timeSlot
            });

            const appointment = appointmentRes.data;
            const price = getSelectedPrice();

            // Step 2: Process mock payment to confirm the appointment
            await axios.post('/payments', {
                appointmentId: appointment._id,
                amount: price,
                paymentMethod: 'mock_credit_card'
            });

            setMessage({ text: 'Booking confirmed & payment successful!', type: 'success' });

            // Reset form (keep the first service selected)
            setBookingForm(prev => ({
                serviceId: prev.serviceId,
                date: '',
                timeSlot: '09:00 AM'
            }));

            // Refresh the appointments list so Service History updates
            await fetchData();
        } catch (err) {
            console.error('Booking error:', err);
            const errorMsg = err.response?.data?.msg || 'Failed to book appointment. Please try again.';
            setMessage({ text: errorMsg, type: 'error' });
        } finally {
            setSubmitting(false);
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
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${customerBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
                padding: '2rem 0'
            }}
        >
            <div className="container">
                <div className="page-header" style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '2rem' }}>
                    <h2 className="page-title" style={{ color: '#fff' }}>Welcome, {user?.name}</h2>
                    <p style={{ color: '#cbd5e1' }}>Manage your vehicle service appointments</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="auth-card" style={{ maxWidth: 'none' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Book an Appointment</h3>

                        {message.text && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: message.type === 'success' ? '#059669' : '#dc2626',
                                border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                            }}>
                                {message.text}
                            </div>
                        )}

                        {services.length === 0 ? (
                            <p style={{ color: '#64748b' }}>No services available. Please check back later.</p>
                        ) : (
                            <form onSubmit={handleBooking}>
                                <div className="form-group">
                                    <label className="form-label">Select Service</label>
                                    <select className="form-control" value={bookingForm.serviceId} onChange={e => setBookingForm({...bookingForm, serviceId: e.target.value})}>
                                        {services.map(s => <option key={s._id} value={s._id}>{s.name} - ${s.price}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Date</label>
                                        <input type="date" className="form-control" value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Time</label>
                                        <select className="form-control" value={bookingForm.timeSlot} onChange={e => setBookingForm({...bookingForm, timeSlot: e.target.value})}>
                                            <option value="09:00 AM">09:00 AM</option>
                                            <option value="11:00 AM">11:00 AM</option>
                                            <option value="02:00 PM">02:00 PM</option>
                                            <option value="04:00 PM">04:00 PM</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ padding: '1rem', background: 'rgba(30, 64, 175, 0.1)', borderRadius: '8px', textAlign: 'center', marginTop: '1rem' }}>
                                    <span style={{ fontSize: '0.875rem', color: '#475569' }}>Total Estimate:</span>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>${getSelectedPrice()}</div>
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-hero-primary" 
                                    style={{ width: '100%', marginTop: '1rem', opacity: submitting ? 0.7 : 1 }}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Processing...' : 'Confirm & Pay'}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="auth-card" style={{ maxWidth: 'none' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Service History</h3>
                        <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="flex flex-col gap-4">
                            {appointments.length === 0 ? (
                                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No service history yet. Book your first appointment!</p>
                            ) : (
                                appointments.map(app => (
                                    <div key={app._id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.4)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.3)' }}>
                                        <div className="flex justify-between">
                                            <strong style={{ color: '#1e293b' }}>{app.service?.name}</strong>
                                            <span className={`badge ${getStatusBadgeClass(app.status)}`}>{app.status}</span>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.5rem' }}>
                                            {new Date(app.date).toLocaleDateString()} at {app.timeSlot}
                                        </div>
                                        {app.service?.price && (
                                            <div style={{ fontSize: '0.85rem', color: '#1e40af', marginTop: '0.25rem', fontWeight: '600' }}>
                                                ${app.service.price}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;