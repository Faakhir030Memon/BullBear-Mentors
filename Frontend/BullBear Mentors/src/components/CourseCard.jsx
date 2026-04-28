import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ChevronRight } from 'lucide-react';

const CourseCard = ({ course }) => {
    return (
        <div className="course-card card fade-in">
            <div className="course-img" style={{ backgroundImage: `url(${course.image || 'https://via.placeholder.com/400x200'})` }}>
                {!course.isActive && <div className="inactive-overlay">Currently Unavailable</div>}
            </div>
            <div className="course-info">
                <div className="course-meta">
                    <span className="course-tag">Trading Course</span>
                    <div className="duration">
                        <Clock size={14} />
                        <span>Self-paced</span>
                    </div>
                </div>
                <h3>{course.title}</h3>
                <p>{course.description.substring(0, 100)}...</p>
                
                <div className="pricing-grid">
                    <div className="price-item">
                        <span className="duration-label">1 Month</span>
                        <span className="price-value">{course.prices.oneMonth.toLocaleString()} PKR</span>
                    </div>
                    <div className="price-item featured-price">
                        <span className="duration-label">12 Month (25% Off)</span>
                        <span className="price-value">{course.prices.twelveMonth.toLocaleString()} PKR</span>
                    </div>
                </div>

                <div className="course-footer">
                    <Link to={`/courses/${course._id}`} className="btn btn-primary btn-block">
                        View Details <ChevronRight size={18} />
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .course-card {
                    padding: 0;
                    overflow: hidden;
                    transition: var(--transition);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .course-card:hover {
                    transform: translateY(-8px);
                    box-shadow: var(--shadow-lg);
                }
                .course-img {
                    height: 200px;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                }
                .inactive-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.6);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    backdrop-filter: blur(2px);
                }
                .course-info {
                    padding: 24px;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }
                .course-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }
                .course-tag {
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    background: var(--bg-secondary);
                    padding: 4px 8px;
                    border-radius: 4px;
                }
                .duration {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 12px;
                    color: var(--text-secondary);
                }
                .course-info h3 {
                    font-size: 20px;
                    margin-bottom: 12px;
                    line-height: 1.3;
                }
                .course-info p {
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin-bottom: 24px;
                }
                .pricing-grid {
                    background: var(--bg-secondary);
                    padding: 12px;
                    border-radius: var(--radius);
                    margin-bottom: 24px;
                }
                .price-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 13px;
                    margin-bottom: 4px;
                }
                .featured-price {
                    color: var(--success);
                    font-weight: 700;
                }
                .course-footer {
                    margin-top: auto;
                }
            `}</style>
        </div>
    );
};

export default CourseCard;
