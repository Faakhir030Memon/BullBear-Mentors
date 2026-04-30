import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Book, Clock, AlertCircle, PlayCircle, Loader, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';

const MyLearningPage = () => {
    const { user } = useAuth();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [adminInfo, setAdminInfo] = useState(null);

    useEffect(() => {
        const fetchMyCourses = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('/api/purchase/my', config);
                setPurchases(data);
                
                // Fetch admin info for chat
                const convRes = await axios.get('/api/messages/conversations', config);
                if (convRes.data && convRes.data.length > 0) {
                    setAdminInfo(convRes.data[0].user);
                }
                
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
                                    <Link to={`/courses/${p.course?._id}`} className="btn btn-primary">
                                        Start Learning <PlayCircle size={18} />
                                    </Link>
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
                                    <div className="pending-info w-100">
                                        <div className="pending-header">
                                            <div className="title-area">
                                                <strong>{p.course?.title}</strong>
                                                <span>Trans ID: {p.transactionId}</span>
                                            </div>
                                            <span className={`status-badge ${p.status}`}>
                                                {p.status === 'active' ? 'APPROVED' : 'PENDING'}
                                            </span>
                                        </div>
                                        
                                        {p.status === 'active' && p.course?.content?.length > 0 && (
                                            <div className="download-area mt-3">
                                                {p.course.content.map((item, idx) => (
                                                    <a 
                                                        key={idx} 
                                                        href={item.fileUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="download-button"
                                                        title={item.description || item.title}
                                                    >
                                                        <Download size={16} /> 
                                                        <span>Download {item.title || 'Material'}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-pending">No recent verifications.</p>
                        )}
                    </div>

                    <div className="help-section card">
                        <h3>Live Support</h3>
                        <p>Need help with your course or payment? Chat directly with our admin for instant support.</p>
                        <button 
                            className="btn btn-primary btn-block mt-3" 
                            onClick={() => setIsChatOpen(true)}
                        >
                            Live Chat with Admin
                        </button>
                    </div>
                </aside>
            </div>

            {isChatOpen && adminInfo && (
                <ChatWindow 
                    recipientId={adminInfo._id} 
                    recipientName={adminInfo.firstName + ' ' + (adminInfo.lastName || '')} 
                    onClose={() => setIsChatOpen(false)} 
                />
            )}

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
                    padding: 16px 0; border-bottom: 1px solid var(--border-color);
                }
                .pending-info { display: flex; flex-direction: column; }
                .pending-header { display: flex; justify-content: space-between; align-items: flex-start; width: 100%; }
                .title-area { display: flex; flex-direction: column; }
                .pending-info strong { font-size: 15px; color: var(--text-main); }
                .pending-info span { font-size: 12px; color: var(--text-secondary); }
                .status-badge { 
                    padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; 
                    text-transform: uppercase; letter-spacing: 0.5px;
                }
                .status-badge.pending { background: #fff7e6; color: #faad14; border: 1px solid #ffe58f; }
                .status-badge.active { background: #f6ffed; color: var(--success); border: 1px solid #b7eb8f; }
                .no-pending { font-size: 13px; color: var(--text-secondary); }
                
                .download-area { display: flex; flex-direction: column; gap: 10px; }
                .download-button { 
                    display: flex; align-items: center; justify-content: center; gap: 10px; 
                    font-size: 13px; font-weight: 600;
                    background: linear-gradient(135deg, var(--success) 0%, #218838 100%);
                    color: white; padding: 10px 16px; border-radius: 8px;
                    text-decoration: none; transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.15);
                }
                .download-button:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 6px 15px rgba(40, 167, 69, 0.25);
                    color: white; 
                    filter: brightness(1.1);
                }
                .download-button span { flex-grow: 1; text-align: center; }
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
