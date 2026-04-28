import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Star, Quote, ChevronRight, Loader } from 'lucide-react';

const AboutPage = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we'd fetch this from the backend
        // For now, let's use some premium placeholder data to WOW the user
        const placeholderStories = [
            {
                id: 1,
                name: "Ahmed Khan",
                role: "Full-time Trader",
                content: "BullBear Mentors changed my life. I went from losing $500/month to consistently making $2000+. The institutional flow strategy is a game changer.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
                type: "story"
            },
            {
                id: 2,
                name: "Sara Ali",
                role: "Part-time Trader",
                content: "As a student, I wanted a side income. This platform gave me the exact roadmap I needed. Highly recommended!",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
                type: "story"
            },
            {
                id: 3,
                name: "Professional Certificate",
                role: "BullBear Mentors",
                content: "All our graduates receive an industry-recognized certificate of completion after finishing the 1-year masterclass.",
                image: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=800&h=500&fit=crop",
                type: "certificate"
            }
        ];
        
        setTimeout(() => {
            setStories(placeholderStories);
            setLoading(false);
        }, 800);
    }, []);

    if (loading) return <div className="loader-container"><Loader size={48} className="animate-spin text-success" /></div>;

    return (
        <div className="about-page container py-5 fade-in">
            <section className="about-hero text-center">
                <div className="badge">Our Success Stories</div>
                <h1>Empowering Traders <span>Worldwide</span></h1>
                <p>Join over 1,200+ students who have transformed their trading journey with BullBear Mentors.</p>
            </section>

            <section className="stories-grid">
                {stories.filter(s => s.type === 'story').map(story => (
                    <div key={story.id} className="story-card card">
                        <div className="quote-icon"><Quote size={32} /></div>
                        <p className="story-content">{story.content}</p>
                        <div className="story-user">
                            <img src={story.image} alt={story.name} />
                            <div>
                                <h4>{story.name}</h4>
                                <span>{story.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <section className="certificates-section">
                <div className="section-header">
                    <h2>Professional Certification</h2>
                    <p>Elevate your credentials with our official certificates.</p>
                </div>
                <div className="certificate-display card">
                    <div className="cert-img">
                        <img src={stories.find(s => s.type === 'certificate')?.image} alt="Certificate" />
                    </div>
                    <div className="cert-info">
                        <div className="badge">Official Accreditation</div>
                        <h3>Verified Completion</h3>
                        <p>Our certificates are blockchain-verified and can be added to your LinkedIn profile or professional resume. They represent 300+ hours of intensive market training.</p>
                        <ul className="cert-features">
                            <li><CheckCircle size={18} className="text-success" /> Lifetime Verification</li>
                            <li><CheckCircle size={18} className="text-success" /> Institutional Recognition</li>
                            <li><CheckCircle size={18} className="text-success" /> QR Code Protected</li>
                        </ul>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .about-hero {
                    margin-bottom: 80px;
                }
                .about-hero h1 {
                    font-size: 56px;
                    font-weight: 800;
                    margin: 20px 0;
                }
                .about-hero h1 span {
                    color: var(--success);
                }
                .stories-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 100px;
                }
                .story-card {
                    padding: 40px;
                    position: relative;
                }
                .quote-icon {
                    color: var(--success);
                    opacity: 0.2;
                    margin-bottom: 20px;
                }
                .story-content {
                    font-size: 18px;
                    font-style: italic;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }
                .story-user {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .story-user img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .story-user h4 {
                    margin: 0;
                }
                .story-user span {
                    font-size: 13px;
                    color: var(--text-secondary);
                }
                .certificates-section {
                    margin-bottom: 80px;
                }
                .section-header {
                    text-align: center;
                    margin-bottom: 48px;
                }
                .section-header h2 {
                    font-size: 32px;
                    font-weight: 700;
                }
                .certificate-display {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    padding: 60px;
                    align-items: center;
                    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                }
                .cert-img img {
                    width: 100%;
                    border-radius: var(--radius);
                    box-shadow: var(--shadow-lg);
                    border: 8px solid white;
                }
                .cert-info h3 {
                    font-size: 32px;
                    margin: 20px 0;
                }
                .cert-info p {
                    color: var(--text-secondary);
                    margin-bottom: 30px;
                    line-height: 1.6;
                }
                .cert-features {
                    list-style: none;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .cert-features li {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                }
                .CheckCircle {
                    color: var(--success);
                }
                @media (max-width: 992px) {
                    .stories-grid, .certificate-display {
                        grid-template-columns: 1fr;
                    }
                    .certificate-display {
                        padding: 30px;
                        gap: 30px;
                    }
                }
            `}</style>
        </div>
    );
};

const CheckCircle = ({ size, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export default AboutPage;
