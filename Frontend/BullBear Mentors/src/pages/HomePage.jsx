import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Award, Users, BookOpen, ChevronRight, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import Scene3D from '../components/Scene3D';
import SmoothScroll from '../components/SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
    const { user } = useAuth();
    const [recentCerts, setRecentCerts] = useState([]);
    const [stories, setStories] = useState([]);
    const [courses, setCourses] = useState([]);
    
    const heroRef = useRef();
    const overviewRef = useRef();
    const coursesRef = useRef();
    const storiesRef = useRef();
    const certRef = useRef();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storyRes, certRes, courseRes] = await Promise.all([
                    axios.get('/api/stories'),
                    axios.get('/api/certificates'),
                    axios.get('/api/courses')
                ]);
                setStories(storyRes.data.filter(s => s.type === 'story').slice(0, 3));
                setRecentCerts(certRes.data.slice(0, 4));
                setCourses(courseRes.data.slice(0, 3));
            } catch (err) {
                console.error('Failed to fetch home data');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Hero Animations
        const ctx = gsap.context(() => {
            gsap.from('.hero-text > *', {
                y: 50,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power4.out'
            });

            gsap.from('.stat-card', {
                x: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.15,
                ease: 'back.out(1.7)',
                delay: 0.5
            });

            // Section Reveals
            const sections = [overviewRef, coursesRef, storiesRef, certRef];
            sections.forEach(ref => {
                if (ref.current) {
                    gsap.from(ref.current.querySelectorAll('.reveal'), {
                        scrollTrigger: {
                            trigger: ref.current,
                            start: 'top 80%',
                            toggleActions: 'play none none reverse'
                        },
                        y: 50,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        ease: 'power2.out'
                    });
                }
            });

            // Parallax Effects
            gsap.to('.hero-content', {
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: 100,
                opacity: 0
            });
        });

        return () => ctx.revert();
    }, [courses, stories]);

    return (
        <div className="home-page">
            <SmoothScroll />
            <Scene3D />
            
            {/* Hero Section */}
            <section className="hero" ref={heroRef}>
                <div className="container hero-content">
                    <div className="hero-text">
                        <div className="badge glass">🔥 The Future of Trading</div>
                        <h1>Master the Battle of <span>Bulls vs Bears</span></h1>
                        <p>Join the elite league of professional traders. Master institutional flow and high-probability strategies with our premium mentorship.</p>
                        <div className="hero-btns">
                            <Link to="/courses" className="btn btn-primary">
                                Get Started Now <ArrowRight size={20} />
                            </Link>
                            <Link to="/about" className="btn btn-outline">
                                View Results
                            </Link>
                        </div>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-card glass">
                            <div className="icon-wrap bull"><TrendingUp size={24} /></div>
                            <div>
                                <h3>95.4%</h3>
                                <p>Success Rate</p>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="icon-wrap bear"><Users size={24} /></div>
                            <div>
                                <h3>2.5k+</h3>
                                <p>Active Traders</p>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="icon-wrap bull"><Award size={24} /></div>
                            <div>
                                <h3>Elite</h3>
                                <p>Global Certification</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview Section */}
            <section className="overview py-10" ref={overviewRef}>
                <div className="container">
                    <div className="overview-grid">
                        <div className="overview-image reveal">
                            <div className="image-glass-wrap">
                                <img src="https://images.unsplash.com/photo-1611974714131-7e873f848148?auto=format&fit=crop&q=80&w=800" alt="Trading Terminal" />
                            </div>
                        </div>
                        <div className="overview-text reveal">
                            <div className="badge glass">Why BullBear Mentors?</div>
                            <h2>Your Gateway to <span>Financial Freedom</span></h2>
                            <p>We don't just teach charts; we teach the psychology and the mechanics of the market. Our ecosystem is built for those who demand excellence.</p>
                            <ul className="features-list">
                                <li><div className="bullet bull"></div> Live Institutional Flow Analysis</li>
                                <li><div className="bullet bull"></div> 1-on-1 Mentorship Sessions</li>
                                <li><div className="bullet bull"></div> Proprietary AI-Driven Signals</li>
                                <li><div className="bullet bull"></div> 24/7 Global Trading Community</li>
                            </ul>
                            <Link to="/about" className="btn btn-primary">Discover More</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Courses Section */}
            <section className="featured py-10" ref={coursesRef}>
                <div className="container">
                    <div className="section-header reveal">
                        <h2>Elite Training <span>Programs</span></h2>
                        <Link to="/courses" className="text-success">Browse All <ChevronRight size={18} /></Link>
                    </div>
                    <div className="course-grid">
                        {(courses.length > 0 ? courses : [1, 2, 3]).map((c, i) => (
                            <div key={c._id || i} className="course-card glass reveal">
                                <div className="course-img" style={{backgroundImage: `url(${c.image || 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400'})`}}></div>
                                <div className="course-info">
                                    <span className="course-tag">{c.category || 'Professional'}</span>
                                    <h3>{c.title || `Advanced Masterclass ${i + 1}`}</h3>
                                    <p>{c.description || 'Master institutional trading strategies and secure your future.'}</p>
                                    <div className="course-footer">
                                        <span className="price">{c.prices?.oneMonth || 'Premium'}</span>
                                        <Link to={c._id ? `/courses/${c._id}` : '/courses'} className="btn btn-primary btn-sm">Join Program</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories Section */}
            <section className="success-stories py-10" ref={storiesRef}>
                <div className="container">
                    <div className="section-header center reveal">
                        <h2>The <span>Wall of Fame</span></h2>
                        <p>From beginners to consistently profitable professional traders.</p>
                    </div>
                    <div className="stories-grid">
                        {stories.length > 0 ? stories.map((story, i) => (
                            <div key={i} className="story-card glass reveal">
                                <div className="story-header">
                                    <img src={story.image} alt={story.name} className="story-avatar" />
                                    <div>
                                        <h4>{story.name}</h4>
                                        <span className="text-success font-bold">Verified Result</span>
                                    </div>
                                </div>
                                <p>"{story.description}"</p>
                                <div className="stars">✨✨✨✨✨</div>
                            </div>
                        )) : (
                            <div className="empty-stories reveal">
                                <Quote size={48} className="text-dim" />
                                <p>Join our mentorship and become our next success story.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Certificate Announcement Section */}
            <section className="cert-announcement py-10" ref={certRef}>
                <div className="container">
                    <div className="cert-grid">
                        <div className="cert-text reveal">
                            <h2>Global <span>Recognition</span></h2>
                            <p>Our certificates are symbols of trading mastery. Validated by the community and recognized across the industry.</p>
                            <Link to="/courses" className="btn btn-success">Get Certified</Link>
                        </div>
                        <div className="cert-preview reveal">
                            <div className="premium-cert-card glass">
                                <div className="cert-inner">
                                    <Award size={64} className="text-success" />
                                    <h3>Certification of Mastery</h3>
                                    <p>Institutional Trading Flow</p>
                                    <div className="cert-line"></div>
                                    <div className="cert-footer">
                                        <span>BullBear Mentors</span>
                                        <span>2026-2027</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .home-page { position: relative; }
                .hero { min-height: 100vh; display: flex; align-items: center; padding: 120px 0; }
                .hero-content { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 80px; align-items: center; }
                .badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 700; font-size: 13px; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px; }
                .hero-text h1 { font-size: 72px; font-weight: 900; line-height: 1; margin-bottom: 24px; letter-spacing: -2px; }
                .hero-text h1 span { 
                    background: linear-gradient(135deg, var(--success) 0%, #00f206 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .hero-text p { font-size: 20px; color: var(--text-dim); margin-bottom: 40px; max-width: 550px; }
                .hero-btns { display: flex; gap: 20px; }
                
                .hero-stats { display: flex; flex-direction: column; gap: 24px; }
                .stat-card { padding: 24px; display: flex; align-items: center; gap: 20px; }
                .stat-card h3 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
                .stat-card p { font-size: 14px; color: var(--text-dim); }
                .icon-wrap { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .icon-wrap.bull { background: rgba(0, 200, 5, 0.1); color: var(--success); }
                .icon-wrap.bear { background: rgba(255, 77, 77, 0.1); color: var(--danger); }

                .py-10 { padding: 120px 0; }
                .section-header { margin-bottom: 60px; display: flex; justify-content: space-between; align-items: flex-end; }
                .section-header h2 { font-size: 48px; font-weight: 800; }
                .section-header h2 span { color: var(--success); }

                .overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
                .image-glass-wrap { padding: 15px; border-radius: 20px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); }
                .overview-image img { width: 100%; border-radius: 12px; filter: grayscale(0.5); transition: var(--transition); }
                .overview-image:hover img { filter: grayscale(0); }
                .overview-text h2 { font-size: 48px; margin-bottom: 30px; }
                .features-list { list-style: none; margin: 40px 0; }
                .features-list li { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; font-size: 18px; font-weight: 500; }
                .bullet { width: 10px; height: 10px; border-radius: 50%; }
                .bullet.bull { background: var(--success); box-shadow: 0 0 10px var(--success); }

                .course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 32px; }
                .course-card { padding: 0; overflow: hidden; }
                .course-card:hover { transform: translateY(-10px); border-color: var(--success); }
                .course-img { height: 240px; background-size: cover; background-position: center; filter: brightness(0.7); }
                .course-info { padding: 32px; }
                .course-tag { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--success); margin-bottom: 15px; display: block; letter-spacing: 1px; }
                .course-info h3 { font-size: 24px; margin-bottom: 15px; }
                .course-info p { color: var(--text-dim); font-size: 15px; margin-bottom: 30px; }
                .course-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 25px; border-top: 1px solid var(--border-glass); }
                .price { font-size: 22px; font-weight: 800; color: white; }

                .stories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px; }
                .story-card { padding: 40px; }
                .story-header { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; }
                .story-avatar { width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--success); padding: 3px; }
                .story-card p { font-size: 16px; color: var(--text-dim); font-style: italic; margin-bottom: 25px; }

                .cert-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
                .premium-cert-card { padding: 60px; text-align: center; position: relative; overflow: hidden; }
                .cert-inner { border: 2px dashed var(--border-glass); padding: 40px; border-radius: 8px; }
                .cert-line { width: 80px; height: 3px; background: var(--success); margin: 30px auto; }
                .cert-footer { display: flex; justify-content: space-between; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; opacity: 0.5; }

                @media (max-width: 1024px) {
                    .hero-content, .overview-grid, .cert-grid { grid-template-columns: 1fr; text-align: center; }
                    .hero-text h1 { font-size: 56px; }
                    .hero-btns, .hero-stats { justify-content: center; align-items: center; }
                    .hero-stats { flex-direction: row; flex-wrap: wrap; }
                    .features-list li { justify-content: center; }
                    .section-header { flex-direction: column; align-items: center; text-align: center; gap: 20px; }
                }
            `}</style>
        </div>
    );
};

export default HomePage;
