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
                                    <div className="course-actions">
                                        {p.course?.content?.length > 0 ? (
                                            p.course.content.map((item, idx) => (
                                                <a 
                                                    key={idx} 
                                                    href={item.fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="btn btn-success download-action-btn"
                                                    title={item.description || item.title}
                                                >
                                                    <Download size={18} /> 
                                                    <span>{item.title || 'Download'}</span>
                                                </a>
                                            ))
                                        ) : (
                                            <span className="no-material-text">No materials attached</span>
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
                                    <div className="pending-info w-100">
                                        <div className="pending-header">
                                            <div className="title-area">
                                                <strong>{p.course?.title}</strong>
                                                <span>Trans ID: {p.transactionId}</span>
                                            </div>
                                            <div className="status-actions-group">
                                                {p.status === 'active' && p.course?.content?.length > 0 && (
                                                    <div className="compact-downloads">
                                                        {p.course.content.map((item, idx) => (
                                                            <a 
                                                                key={idx} 
                                                                href={item.fileUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="icon-download-btn"
                                                                title={`Download: ${item.title || 'Material'}`}
                                                            >
                                                                <Download size={16} />
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                                <span className={`status-badge ${p.status}`}>
                                                    {p.status === 'active' ? 'APPROVED' : 'PENDING'}
                                                </span>
                                            </div>
                                        </div>
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
                .card-top { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
                .course-icon { 
                    width: 50px; height: 50px; background: var(--bg-secondary); 
                    border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--success);
                    flex-shrink: 0;
                }
                .course-info { flex-grow: 1; min-width: 200px; }
                .course-info h3 { font-size: 18px; margin-bottom: 4px; }
                .course-actions { display: flex; flex-wrap: wrap; gap: 12px; }
                .download-action-btn {
                    display: flex; align-items: center; gap: 10px;
                    padding: 10px 20px; font-weight: 600;
                    box-shadow: 0 4px 12px rgba(0, 200, 5, 0.2);
                    transition: all 0.3s ease;
                }
                .download-action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(0, 200, 5, 0.3);
                    filter: brightness(1.05);
                }
                .no-material-text { font-size: 13px; color: var(--text-secondary); font-style: italic; }
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
                
                .status-actions-group { display: flex; align-items: center; gap: 10px; }
                .compact-downloads { display: flex; gap: 6px; }
                .icon-download-btn {
                    width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
                    background: var(--bg-secondary); border: 1px solid var(--border-color);
                    border-radius: 8px; color: var(--success); transition: all 0.2s ease;
                }
                .icon-download-btn:hover {
                    background: var(--success); color: white; border-color: var(--success);
                    transform: translateY(-2px);
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
                .live-dot {
                    width: 12px; height: 12px; background: #ff4d4f; border-radius: 50%;
                    box-shadow: 0 0 0 rgba(255, 77, 79, 0.4);
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(255, 77, 79, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0); }
                }
                .course-tag {
                    display: inline-block; padding: 2px 8px; background: var(--bg-secondary);
                    color: var(--primary); font-size: 11px; font-weight: 700; border-radius: 4px;
                    text-transform: uppercase;
                }
                .session-card {
                    border-left: 4px solid var(--success) !important;
                    transition: transform 0.2s;
                }
                .session-card:hover { transform: scale(1.01); }
                .join-btn {
                    padding: 12px 24px; font-weight: 700; border-radius: 30px;
                    display: flex; align-items: center; gap: 10px;
                }
                .gap-3 { gap: 12px; }
                .gap-4 { gap: 20px; }
                .mb-5 { margin-bottom: 40px; }
                .mt-1 { margin-top: 4px; }
                .mt-2 { margin-top: 8px; }
                .border-left-success { border-left: 4px solid var(--success); }
            `}</style>
        </div>
    );
};

export default MyLearningPage;
