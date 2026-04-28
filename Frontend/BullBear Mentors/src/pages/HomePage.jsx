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

            {/* Featured Courses Section */}
            <section className="featured">
                <div className="container">
                    <div className="section-header">
                        <h2>Featured Courses</h2>
                        <Link to="/courses" className="text-success">View All <ChevronRight size={18} /></Link>
                    </div>
                    <div className="course-grid">
                        {/* Placeholder Course Cards */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="course-card card">
                                <div className="course-img"></div>
                                <div className="course-info">
                                    <span className="course-tag">Beginner</span>
                                    <h3>Advanced Price Action {i}</h3>
                                    <p>Master the art of reading charts without indicators using institutional methods.</p>
                                    <div className="course-footer">
                                        <span className="price">30,000 PKR</span>
                                        <Link to={`/courses/${i}`} className="btn btn-primary btn-sm">Join Now</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <style jsx>{`
                .home-page {
                    padding-bottom: 80px;
                }
                .hero {
                    padding: 80px 0;
                    background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
                }
                .hero-content {
                    display: grid;
                    grid-template-columns: 1.2fr 0.8fr;
                    gap: 60px;
                    align-items: center;
                }
                .badge {
                    display: inline-block;
                    padding: 6px 12px;
                    background-color: rgba(0, 200, 5, 0.1);
                    color: var(--success);
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                .hero-text h1 {
                    font-size: 56px;
                    font-weight: 800;
                    line-height: 1.1;
                    margin-bottom: 24px;
                }
                .hero-text h1 span {
                    color: var(--success);
                }
                .hero-text p {
                    font-size: 18px;
                    color: var(--text-secondary);
                    margin-bottom: 32px;
                    max-width: 500px;
                }
                .hero-btns {
                    display: flex;
                    gap: 16px;
                }
                .btn-outline {
                    border: 1px solid var(--border-color);
                    background: white;
                }
                .hero-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .stat-card {
                    background: white;
                    padding: 20px;
                    border-radius: var(--radius);
                    box-shadow: var(--shadow-md);
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    border-left: 4px solid var(--success);
                }
                .stat-card h3 {
                    font-size: 24px;
                    margin-bottom: 4px;
                }
                .stat-card p {
                    font-size: 14px;
                    color: var(--text-secondary);
                }
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 80px 0 32px;
                }
                .section-header h2 {
                    font-size: 32px;
                    font-weight: 700;
                }
                .course-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 30px;
                }
                .course-card {
                    padding: 0;
                    overflow: hidden;
                    transition: var(--transition);
                }
                .course-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-lg);
                }
                .course-img {
                    height: 200px;
                    background-color: #eee;
                    background-image: linear-gradient(45deg, #000 0%, #333 100%);
                }
                .course-info {
                    padding: 24px;
                }
                .course-tag {
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    color: var(--text-secondary);
                    margin-bottom: 12px;
                    display: block;
                }
                .course-info h3 {
                    margin-bottom: 12px;
                }
                .course-info p {
                    color: var(--text-secondary);
                    font-size: 14px;
                    margin-bottom: 24px;
                }
                .course-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 20px;
                    border-top: 1px solid var(--border-color);
                }
                .price {
                    font-size: 20px;
                    font-weight: 700;
                    color: var(--primary);
                }
                .btn-sm {
                    padding: 8px 16px;
                    font-size: 14px;
                }
                @media (max-width: 1024px) {
                    .hero-content {
                        grid-template-columns: 1fr;
                        text-align: center;
                    }
                    .hero-text p {
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
                }
            `}</style>
        </div>
    );
};

export default HomePage;
