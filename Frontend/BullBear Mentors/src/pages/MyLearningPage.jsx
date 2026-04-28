import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Book, Clock, AlertCircle, PlayCircle, Loader } from 'lucide-react';
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
    const pendingPurchases = purchases.filter(p => p.status === 'pending');

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
                        <h3>Pending Verifications</h3>
                        {pendingPurchases.length > 0 ? (
                            pendingPurchases.map(p => (
                                <div key={p._id} className="pending-item">
                                    <div className="pending-info">
                                        <strong>{p.course?.title}</strong>
                                        <span>Trans ID: {p.transactionId}</span>
                                    </div>
                                    <span className="status-badge pending">PENDING</span>
                                </div>
                            ))
                        ) : (
                            <p className="no-pending">No pending verifications.</p>
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
                .no-pending { font-size: 13px; color: var(--text-secondary); }
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
