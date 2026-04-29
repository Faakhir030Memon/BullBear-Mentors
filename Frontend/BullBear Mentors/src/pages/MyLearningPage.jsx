import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Book, Clock, AlertCircle, PlayCircle, Loader, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyLearningPage = () => {
    const { user } = useAuth();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('/api/purchase/my', config);
                setPurchases(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchMyCourses();
    }, [user.token]);

    if (loading) return <div className="loader-container"><Loader size={48} className="animate-spin text-success" /></div>;

    const activePurchases = purchases.filter(p => p.status === 'active' && new Date(p.expiryDate) > new Date());
    const verificationItems = purchases.filter(p => p.status === 'pending' || p.status === 'active');

    return (
        <div className="my-learning container py-5 fade-in">
            <div className="section-header">
                <h1>My Learning Dashboard</h1>
                <p>Track your progress and access your active trading courses.</p>
            </div>

            <div className="learning-grid">
                {/* Active Courses */}
                <div className="active-courses">
                    <h2>Active Courses</h2>
                    {activePurchases.length > 0 ? (
                        activePurchases.map(p => (
                            <div key={p._id} className="course-access-card card mb-4">
                                <div className="card-top">
                                    <div className="course-icon"><Book size={24} /></div>
                                    <div className="course-info">
                                        <h3>{p.course?.title}</h3>
                                        <div className="expiry-info">
                                            <Clock size={14} />
                                            <span>Expires on: {new Date(p.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="course-actions">
                                        <Link to={`/courses/${p.course?._id}`} className="btn btn-primary">
                                            Start Learning <PlayCircle size={18} />
                                        </Link>
                                        {p.course?.content?.length > 0 && (
                                            <div className="course-downloads mt-3">
                                                <p className="small-label">Resources:</p>
                                                <div className="download-grid">
                                                    {p.course.content.map((file, i) => (
                                                        <a key={i} href={file.fileUrl} target="_blank" rel="noreferrer" className="download-btn-pill">
                                                            <Download size={14} /> {file.title || 'Material'}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state card">
                            <Book size={48} className="text-secondary mb-3" />
                            <p>You don't have any active courses yet.</p>
                            <Link to="/courses" className="text-success font-weight-bold">Browse Courses</Link>
                        </div>
                    )}
                </div>

                {/* Pending & Stats */}
                <aside className="learning-sidebar">
                    <div className="pending-section card mb-4">
                        <h3>Verification Status</h3>
                        {verificationItems.length > 0 ? (
                            verificationItems.map(p => (
                                <div key={p._id} className="pending-item">
                                    <div className="pending-info">
                                        <strong>{p.course?.title}</strong>
                                        <span>Trans ID: {p.transactionId}</span>
                                        {p.status === 'active' && (
                                            <div className="download-area mt-2">
                                                {p.course?.content?.length > 0 ? (
                                                    p.course.content.map((item, idx) => (
                                                        <a 
                                                            key={idx} 
                                                            href={item.fileUrl} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="download-link"
                                                            title={item.description || item.title}
                                                        >
                                                            <Download size={12} /> {item.title || 'File'}
                                                        </a>
                                                    ))
                                                ) : (
                                                    <span className="no-files-text">No files attached to this course.</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <span className={`status-badge ${p.status}`}>
                                        {p.status === 'active' ? 'APPROVED' : 'PENDING'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="no-pending">No recent verifications.</p>
                        )}
                    </div>

                    <div className="help-section card">
                        <h3>Need Help?</h3>
                        <p>If your course isn't activated within 24 hours, please contact our support team.</p>
                        <button className="btn btn-outline btn-block mt-3">Contact Support</button>
                    </div>
                </aside>
            </div>

            <style>{`
                .section-header { margin-bottom: 48px; }
                .learning-grid { display: grid; grid-template-columns: 1fr 350px; gap: 40px; }
                .active-courses h2 { margin-bottom: 24px; }
                .course-access-card { padding: 24px; }
                .card-top { display: flex; align-items: center; gap: 20px; }
                .course-icon { 
                    width: 50px; height: 50px; background: var(--bg-secondary); 
                    border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--success);
                }
                .course-info { flex-grow: 1; }
                .course-info h3 { font-size: 18px; margin-bottom: 4px; }
                .expiry-info { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-secondary); }
                .empty-state { text-align: center; padding: 60px; }
                .pending-section h3 { font-size: 16px; margin-bottom: 20px; }
                .pending-item { 
                    display: flex; justify-content: space-between; align-items: center; 
                    padding: 12px 0; border-bottom: 1px solid var(--border-color);
                }
                .pending-info { display: flex; flex-direction: column; }
                .pending-info strong { font-size: 14px; }
                .pending-info span { font-size: 11px; color: var(--text-secondary); }
                .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; }
                .status-badge.pending { background: #fff7e6; color: #faad14; }
                .status-badge.active { background: #f6ffed; color: var(--success); }
                .no-pending { font-size: 13px; color: var(--text-secondary); }
                .download-area { display: flex; flex-wrap: wrap; gap: 8px; }
                .download-link { 
                    display: flex; align-items: center; gap: 4px; 
                    font-size: 11px; background: var(--bg-secondary); 
                    padding: 4px 8px; border-radius: 4px; color: var(--text-main);
                    text-decoration: none; border: 1px solid var(--border-color);
                    transition: all 0.2s;
                }
                .download-link:hover { background: var(--success); color: white; border-color: var(--success); }
                .course-actions { display: flex; flex-direction: column; gap: 10px; min-width: 200px; }
                .small-label { font-size: 11px; font-weight: 700; color: var(--text-secondary); margin-bottom: 5px; text-transform: uppercase; }
                .download-grid { display: flex; flex-wrap: wrap; gap: 6px; }
                .download-btn-pill { 
                    display: flex; align-items: center; gap: 5px; padding: 6px 12px; 
                    background: var(--bg-secondary); border: 1px solid var(--border-color);
                    border-radius: 20px; font-size: 12px; color: var(--text-main); text-decoration: none;
                    transition: all 0.3s;
                }
                .download-btn-pill:hover { background: var(--success); color: white; border-color: var(--success); transform: translateY(-2px); }
                .no-files-text { font-size: 11px; color: var(--text-secondary); font-style: italic; }
                .help-section h3 { font-size: 16px; margin-bottom: 15px; }
                .help-section p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
                .mb-3 { margin-bottom: 1rem; }
                .mb-4 { margin-bottom: 1.5rem; }
                .mt-3 { margin-top: 1rem; }
                @media (max-width: 992px) {
                    .learning-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default MyLearningPage;
