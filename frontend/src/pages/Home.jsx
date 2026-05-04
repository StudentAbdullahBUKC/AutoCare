import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/splash logo.png'; // Import the local clean file
import workshopBg from '../assets/home background.jpg';

const serviceIcons = {
    'Oil Change': '🛢️',
    'Car Wash & Detailing': '✨',
    'Vehicle Diagnostics': '🔍',
    'Brake Inspection & Service': '🛑',
    'Tire Rotation & Balancing': '🔄',
    'Air Conditioning Service': '❄️',
};

const getIcon = (name) => {
    for (const key of Object.keys(serviceIcons)) {
        if (name.toLowerCase().includes(key.toLowerCase().split(' ')[0].toLowerCase())) {
            return serviceIcons[key];
        }
    }
    return '🔧';
};

const Home = () => {
    const { user, loading } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [splash, setSplash] = useState(true);
    const navigate = useNavigate();
    const servicesRef = useRef(null);

    useEffect(() => {
        // Splash screen: 2 seconds then fade
        const timer = setTimeout(() => setSplash(false), 2200);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        axios.get('/services')
            .then(res => setServices(res.data))
            .catch(err => console.error(err))
            .finally(() => setServicesLoading(false));
    }, []);

    const handleBookNow = () => {
        if (!loading && user) {
            navigate(user.role === 'admin' ? '/admin' : '/customer');
        } else {
            navigate('/login');
        }
    };

    const scrollToServices = () => {
        servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (splash) {
        return (
            <div className="splash-screen">
                <div className="splash-content">
                    <div className="splash-logo">
                        <img src={logo} alt="AutoCare Logo" className="splash-logo-img" />
                        <h1 className="splash-title">AutoCare</h1>
                    </div>
                    <p className="splash-tagline">Professional Vehicle Services</p>
                    <div className="splash-loader">
                        <div className="splash-bar"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="home-page" style={{ backgroundImage: `url(${workshopBg})` }}>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg-overlay" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
                <div className="container hero-content">
                    <div className="hero-badge">⭐ Trusted by 5,000+ Customers</div>
                    <h1 className="hero-title">
                        Expert Car Care,<br />
                        <span className="hero-title-accent">At Your Service</span>
                    </h1>
                    <p className="hero-subtitle">
                        From quick oil changes to full diagnostics — our certified technicians keep your vehicle running at its best.
                    </p>
                    <div className="hero-cta">
                        <button className="btn btn-hero-primary" onClick={handleBookNow} id="book-now-btn">
                            📅 Book an Appointment
                        </button>
                        <button className="btn btn-hero-secondary" onClick={scrollToServices} id="view-services-btn">
                            View All Services ↓
                        </button>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <span className="hero-stat-num">6+</span>
                            <span className="hero-stat-label">Services</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <span className="hero-stat-num">5k+</span>
                            <span className="hero-stat-label">Customers</span>
                        </div>
                        <div className="hero-stat-divider" />
                        <div className="hero-stat">
                            <span className="hero-stat-num">10+</span>
                            <span className="hero-stat-label">Years Exp.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section" ref={servicesRef}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">What We Offer</span>
                        <h2 className="section-title">Our Services</h2>
                        <p className="section-subtitle">
                            Choose from our range of professional automotive services, all carried out by certified experts.
                        </p>
                    </div>

                    {servicesLoading ? (
                        <div className="services-skeleton">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="skeleton-card" />
                            ))}
                        </div>
                    ) : (
                        <div className="services-grid">
                            {services.map(service => (
                                <div key={service._id} className="service-card">
                                    <div className="service-card-icon">{getIcon(service.name)}</div>
                                    <h3 className="service-card-title">{service.name}</h3>
                                    <p className="service-card-desc">{service.description}</p>
                                    <div className="service-card-footer">
                                        <div className="service-price">
                                            <span className="price-label">From</span>
                                            <span className="price-value">${service.price}</span>
                                        </div>
                                        <span className="service-duration">⏱ {service.duration} mins</span>
                                    </div>
                                    <button className="service-book-btn" onClick={handleBookNow}>
                                        Book Now →
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="services-cta">
                        <button className="btn btn-hero-primary" onClick={handleBookNow} id="bottom-book-btn">
                            📅 Book an Appointment Today
                        </button>
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="why-us-section">
                <div className="container">
                    <div className="why-grid">
                        <div className="why-card">
                            <span className="why-icon">🏆</span>
                            <h4>Certified Experts</h4>
                            <p>All technicians are fully certified and trained to the highest standards.</p>
                        </div>
                        <div className="why-card">
                            <span className="why-icon">⚡</span>
                            <h4>Fast Turnaround</h4>
                            <p>Most services completed same-day, so you're back on the road quickly.</p>
                        </div>
                        <div className="why-card">
                            <span className="why-icon">💰</span>
                            <h4>Transparent Pricing</h4>
                            <p>No hidden fees. You see the full price before you book — always.</p>
                        </div>
                        <div className="why-card">
                            <span className="why-icon">📱</span>
                            <h4>Easy Online Booking</h4>
                            <p>Book, manage, and track your appointments entirely online.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
