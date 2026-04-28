import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Book, Clock, PlayCircle, Loader, Download, CheckCircle } from 'lucide-react';
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

    // Admin ke verify karne ke baad status 'active' hota hai
    const activePurchases = purchases.filter(p => p.status === 'active' && new Date(p.expiryDate) > new Date());
    const pendingPurchases = purchases.filter(p => p.status === 'pending');

    return (
        <div className="my-learning container py-5 fade-in">
            <div className="section-header">
                <h1>My Learning Dashboard</h1>
                <p>Track your progress and access your active trading courses.</p>
            </div>

            <div className="learning-grid">
                {/* Active Courses - Left Side */}
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

                                {/* Course files / materials */}
                                {p.course?.content && p.course.content.length > 0 && (
                                    <div className="course-materials">
                                        <p className="materials-title">📁 Course Materials</p>
                                        {p.course.content.map((item, i) => (
                                            <div key={i} className="material-item">
                                                <span className="material-label">
                                                    {item.fileType?.includes('video') ? '🎬' : item.fileType?.includes('pdf') ? '📄' : '📁'}
                                                    {' '}{item.title}
                                                </span>
                                                <a
                                                    href={item.fileUrl}
                                                    download
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="download-btn-inline"
                                                >
                                                    <Download size={13} /> Download
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                )}
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

                {/* Right Sidebar */}
                <aside className="learning-sidebar">

                    {/* Pending Verifications */}
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

                    {/* Approved (Active) Courses with Downloads */}
                    {activePurchases.length > 0 && (
                        <div className="approved-section card mb-4">
                            <h3><CheckCircle size={16} style={{color: '#16a34a', marginRight: 6, verticalAlign: 'middle'}} />Approved Courses</h3>
                            {activePurchases.map(p => (
                                <div key={p._id} className="approved-item">
                                    <div className="approved-header">
                                        <div className="approved-info">
                                            <strong>{p.course?.title}</strong>
                                            <span>Valid till: {new Date(p.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                        <span className="status-badge approved">APPROVED ✓</span>
                                    </div>

                                    {/* Download buttons */}
                                    {p.course?.content && p.course.content.length > 0 ? (
                                        <div className="sidebar-downloads">
                                            <p className="download-label">📥 Download Files:</p>
                                            {p.course.content.map((item, i) => (
                                                <a
                                                    key={i}
                                                    href={item.fileUrl}
                                                    download
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="sidebar-download-btn"
                                                >
                                                    <Download size={13} />
                                                    {' '}
                                                    {item.fileType?.includes('video') ? '🎬' : item.fileType?.includes('pdf') ? '📄' : '📁'}
                                                    {' '}{item.title}
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-files-msg">Materials are being prepared by the instructor.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

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

                /* Course materials inside active card */
                .course-materials { margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color, #eee); }
                .materials-title { font-size: 12px; font-weight: 700; color: var(--text-secondary); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
                .material-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f9f9f9; border-radius: 6px; margin-bottom: 6px; border: 1px solid #f0f0f0; }
                .material-label { font-size: 13px; color: #333; display: flex; align-items: center; gap: 6px; }
                .download-btn-inline { 
                    display: flex; align-items: center; gap: 4px;
                    font-size: 12px; font-weight: 600; color: var(--success, #16a34a); 
                    text-decoration: none; padding: 5px 10px; border: 1px solid var(--success, #16a34a); 
                    border-radius: 5px; white-space: nowrap; transition: all 0.2s;
                }
                .download-btn-inline:hover { background: var(--success, #16a34a); color: white; }

                /* Sidebar */
                .pending-section h3, .approved-section h3, .help-section h3 { font-size: 16px; margin-bottom: 20px; }
                .pending-item { 
                    display: flex; justify-content: space-between; align-items: center; 
                    padding: 12px 0; border-bottom: 1px solid var(--border-color);
                }
                .pending-info { display: flex; flex-direction: column; }
                .pending-info strong { font-size: 14px; }
                .pending-info span { font-size: 11px; color: var(--text-secondary); }

                /* Approved section in sidebar */
                .approved-item { padding: 14px 0; border-bottom: 1px solid var(--border-color, #eee); }
                .approved-item:last-child { border-bottom: none; }
                .approved-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 8px; }
                .approved-info { display: flex; flex-direction: column; }
                .approved-info strong { font-size: 14px; }
                .approved-info span { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }

                /* Sidebar download buttons */
                .sidebar-downloads { display: flex; flex-direction: column; gap: 6px; }
                .download-label { font-size: 11px; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
                .sidebar-download-btn {
                    display: flex; align-items: center; gap: 6px; width: 100%; padding: 8px 12px;
                    background: var(--success, #16a34a); color: white; font-size: 12px; font-weight: 600;
                    border-radius: 6px; text-decoration: none; transition: opacity 0.2s;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .sidebar-download-btn:hover { opacity: 0.85; color: white; }
                .no-files-msg { font-size: 12px; color: var(--text-secondary); font-style: italic; margin-top: 4px; }

                /* Status badges */
                .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
                .status-badge.pending { background: #fff7e6; color: #faad14; }
                .status-badge.approved { background: #f6ffed; color: #16a34a; border: 1px solid #b7eb8f; }

                .no-pending { font-size: 13px; color: var(--text-secondary); }
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
