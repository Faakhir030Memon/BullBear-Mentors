import React from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Award, Users, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const { user } = useAuth();

    return (
        <div className="home-page fade-in">
            {/* Hero Section */}
            <section className="hero">
                <div className="container hero-content">
                    <div className="hero-text">
                        <div className="badge">Welcome back, {user?.firstName}</div>
                        <h1>Master the Markets with <span>BullBear Mentors</span></h1>
                        <p>Learn professional trading strategies from experts. From basic technical analysis to advanced institutional flow.</p>
                        <div className="hero-btns">
                            <Link to="/courses" className="btn btn-primary">
                                Explore Courses <ChevronRight size={20} />
                            </Link>
                            <Link to="/about" className="btn btn-outline">
                                Success Stories
                            </Link>
                        </div>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-card">
                            <TrendingUp className="text-success" />
                            <div>
                                <h3>95%</h3>
                                <p>Success Rate</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <Users className="text-primary" />
                            <div>
                                <h3>1,200+</h3>
                                <p>Active Students</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <Award className="text-success" />
                            <div>
                                <h3>Premium</h3>
                                <p>Certificates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview Section */}
            <section className="overview py-5">
                <div className="container">
                    <div className="overview-grid">
                        <div className="overview-image">
                            <img src="https://images.unsplash.com/photo-1611974714851-48206139d733?auto=format&fit=crop&q=80&w=800" alt="Trading Analysis" />
                        </div>
                        <div className="overview-text">
                            <div className="badge">Why BullBear Mentors?</div>
                            <h2>Your Gateway to <span>Financial Independence</span></h2>
                            <p>BullBear Mentors is more than just a course. It's a comprehensive ecosystem designed to take you from a beginner to a professional trader. We focus on high-probability institutional trading methods that the big players use.</p>
                            <ul className="features-list">
                                <li><CheckCircle className="text-success" size={20} /> Live Market Analysis & Signals</li>
                                <li><CheckCircle className="text-success" size={20} /> Mentorship from Professional Traders</li>
                                <li><CheckCircle className="text-success" size={20} /> Proprietary Trading Strategies</li>
                                <li><CheckCircle className="text-success" size={20} /> Lifetime Community Access</li>
                            </ul>
                            <Link to="/about" className="btn btn-primary">Learn More About Us</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Courses Section */}
            <section className="featured bg-light py-5">
                <div className="container">
                    <div className="section-header">
                        <h2>Our Premium Courses</h2>
                        <Link to="/courses" className="text-success">View All Courses <ChevronRight size={18} /></Link>
                    </div>
                    <div className="course-grid">
                        {/* Placeholder Course Cards - In real app these would be fetched */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="course-card card">
                                <div className="course-img" style={{backgroundImage: `url(https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400)`}}></div>
                                <div className="course-info">
                                    <span className="course-tag">Bestseller</span>
                                    <h3>Advanced SMC {i}</h3>
                                    <p>Master Smart Money Concepts and trade alongside central banks with precision.</p>
                                    <div className="course-footer">
                                        <span className="price">45,000 PKR</span>
                                        <Link to={`/courses/${i}`} className="btn btn-primary btn-sm">Join Now</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories Section */}
            <section className="success-stories py-5">
                <div className="container">
                    <div className="section-header center">
                        <h2>Student <span>Success Stories</span></h2>
                        <p>Real results from real people who followed our mentorship program.</p>
                    </div>
                    <div className="stories-grid">
                        {[
                            { name: "Ahmed Khan", result: "+$2,400 Profit", text: "Before BBM, I was gambling. Now I understand market structure and trade with discipline.", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
                            { name: "Saira Bano", result: "Funded Trader", text: "The institutional flow course changed my life. I just got funded with a $50k account!", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" },
                            { name: "Zubair Ali", result: "90% Win Rate", text: "Simple, effective, and straight to the point. The mentors are always there to help.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" }
                        ].map((story, i) => (
                            <div key={i} className="story-card card">
                                <div className="story-header">
                                    <img src={story.img} alt={story.name} className="story-avatar" />
                                    <div>
                                        <h4>{story.name}</h4>
                                        <span className="text-success font-bold">{story.result}</span>
                                    </div>
                                </div>
                                <p>"{story.text}"</p>
                                <div className="stars">⭐⭐⭐⭐⭐</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certificate Announcement Section */}
            <section className="cert-announcement bg-dark py-5">
                <div className="container">
                    <div className="cert-grid">
                        <div className="cert-text">
                            <h2>Get <span>Certified</span></h2>
                            <p>Complete any of our courses and receive a globally recognized certificate from BullBear Mentors to showcase your expertise in the financial markets.</p>
                            <Link to="/courses" className="btn btn-success">Start Your Journey</Link>
                        </div>
                        <div className="cert-preview">
                            <div className="dummy-cert">
                                <Award size={64} className="cert-icon" />
                                <h3>Certificate of Excellence</h3>
                                <p>Presented to</p>
                                <div className="cert-name">Your Name Here</div>
                                <p>For successfully completing the Advanced Trading Program</p>
                                <div className="cert-footer">
                                    <span>Issued by BBM</span>
                                    <span>2026</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

                .bg-light { background-color: #f8f9fa; }
                .bg-dark { background-color: #111; color: white; }
                .py-5 { padding: 80px 0; }
                .center { text-align: center; }
                .font-bold { font-weight: 700; }

                /* Overview Styles */
                .overview-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    align-items: center;
                }
                .overview-image img {
                    width: 100%;
                    border-radius: var(--radius);
                    box-shadow: var(--shadow-lg);
                }
                .overview-text h2 {
                    font-size: 40px;
                    margin-bottom: 24px;
                }
                .features-list {
                    list-style: none;
                    margin: 32px 0;
                }
                .features-list li {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                    font-weight: 500;
                }

                /* Success Stories Styles */
                .stories-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 30px;
                }
                .story-card {
                    padding: 30px;
                }
                .story-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .story-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .story-card p {
                    font-style: italic;
                    color: var(--text-secondary);
                    margin-bottom: 20px;
                    line-height: 1.6;
                }

                /* Certificate Styles */
                .cert-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    align-items: center;
                }
                .cert-text h2 {
                    font-size: 40px;
                    margin-bottom: 24px;
                }
                .cert-text p {
                    font-size: 18px;
                    opacity: 0.8;
                    margin-bottom: 32px;
                }
                .dummy-cert {
                    background: white;
                    color: #333;
                    padding: 40px;
                    border-radius: 4px;
                    border: 15px solid #111;
                    outline: 2px solid #c9a050;
                    outline-offset: -10px;
                    text-align: center;
                    position: relative;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }
                .cert-icon {
                    color: #c9a050;
                    margin-bottom: 20px;
                }
                .cert-name {
                    font-size: 28px;
                    font-family: 'Serif', serif;
                    font-weight: 700;
                    border-bottom: 2px solid #333;
                    display: inline-block;
                    margin: 20px 0;
                    padding: 0 20px;
                }
                .cert-footer {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 40px;
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                @media (max-width: 1024px) {
                    .hero-content, .overview-grid, .cert-grid {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }
                    .hero-text p, .cert-text p {
                        margin: 0 auto 32px;
                    }
                    .hero-btns {
                        justify-content: center;
                    }
                    .hero-stats {
                        flex-direction: row;
                        flex-wrap: wrap;
                        justify-content: center;
                    }
                    .features-list li {
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default HomePage;
