import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Book, Clock, AlertCircle, PlayCircle, Loader, Download, FileText, Video, File, X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatWindow from '../components/ChatWindow';

const MyLearningPage = () => {
    const { user } = useAuth();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [adminInfo, setAdminInfo] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [downloading, setDownloading] = useState(null);

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

    const handleDownload = async (courseId, fileIndex, fileName) => {
        setDownloading(`${courseId}-${fileIndex}`);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
                responseType: 'blob'
            };
            const { data } = await axios.get(`/api/courses/${courseId}/download/${fileIndex}`, config);
            
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'course-material');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            setDownloading(null);
        } catch (err) {
            console.error(err);
            alert('Download failed. Please try again.');
            setDownloading(null);
        }
    };

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
                                    <div className="card-actions">
                                        <Link to={`/courses/${p.course?._id}`} className="btn btn-primary">
                                            Start Learning <PlayCircle size={18} />
                                        </Link>
                                        {p.course?.content?.length > 0 && (
                                            <button 
                                                className="btn btn-outline-success ml-2"
                                                onClick={() => {
                                                    setSelectedCourse(p.course);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <Download size={18} /> Resources
                                            </button>
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

            {showModal && selectedCourse && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="download-modal fade-in" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedCourse.title} - Resources</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="files-list">
                                {selectedCourse.content.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <div className="file-icon">
                                            {file.fileType?.includes('video') ? <Video size={24} /> : 
                                             file.fileType?.includes('pdf') ? <FileText size={24} /> : <File size={24} />}
                                        </div>
                                        <div className="file-details">
                                            <div className="file-name">{file.title || 'Course Material'}</div>
                                            <div className="file-meta">
                                                <span>{file.fileSize || 'N/A'}</span>
                                                <span className="dot">•</span>
                                                <span>{file.fileType?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn-download-action"
                                            onClick={() => handleDownload(selectedCourse._id, index, file.title)}
                                            disabled={downloading === `${selectedCourse._id}-${index}`}
                                        >
                                            {downloading === `${selectedCourse._id}-${index}` ? (
                                                <Loader className="animate-spin" size={18} />
                                            ) : (
                                                <Download size={18} />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="secure-badge">
                                <CheckCircle size={14} className="text-success" />
                                Secure Download System
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .section-header { margin-bottom: 48px; }
                .learning-grid { display: grid; grid-template-columns: 1fr 350px; gap: 40px; }
                .active-courses h2 { margin-bottom: 24px; }
                .course-access-card { padding: 24px; transition: all 0.3s ease; }
                .course-access-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                .card-top { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
                .course-icon { 
                    width: 60px; height: 60px; background: #f0fdf4; 
                    border-radius: 16px; display: flex; align-items: center; justify-content: center; color: var(--success);
                }
                .course-info { flex-grow: 1; min-width: 200px; }
                .course-info h3 { font-size: 20px; margin-bottom: 8px; font-weight: 700; }
                .expiry-info { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text-secondary); }
                .card-actions { display: flex; gap: 12px; }
                
                .btn-outline-success {
                    border: 2px solid var(--success); color: var(--success); background: transparent;
                    padding: 10px 20px; border-radius: 10px; font-weight: 600; display: flex; align-items: center; gap: 8px;
                    transition: all 0.2s;
                }
                .btn-outline-success:hover { background: var(--success); color: white; }

                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
                    display: flex; align-items: center; justify-content: center; z-index: 1000;
                }
                .download-modal {
                    background: white; width: 90%; max-width: 500px; border-radius: 24px;
                    overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                }
                .modal-header { 
                    padding: 24px; border-bottom: 1px solid #f0f0f0; display: flex; 
                    justify-content: space-between; align-items: center; background: #fafafa;
                }
                .modal-header h3 { font-size: 18px; font-weight: 700; color: #1a1a1a; }
                .close-btn { background: none; border: none; cursor: pointer; color: #666; transition: color 0.2s; }
                .close-btn:hover { color: var(--danger); }
                
                .modal-body { padding: 24px; max-height: 400px; overflow-y: auto; }
                .file-item { 
                    display: flex; align-items: center; gap: 16px; padding: 16px;
                    border: 1px solid #f0f0f0; border-radius: 16px; margin-bottom: 12px;
                    transition: all 0.2s;
                }
                .file-item:hover { border-color: var(--success); background: #f6ffed; }
                .file-icon { 
                    width: 48px; height: 48px; background: #f8f9fa; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center; color: #666;
                }
                .file-details { flex-grow: 1; }
                .file-name { font-weight: 600; font-size: 15px; color: #333; margin-bottom: 4px; }
                .file-meta { font-size: 12px; color: #888; display: flex; align-items: center; gap: 6px; }
                .dot { color: #ccc; }
                
                .btn-download-action {
                    width: 40px; height: 40px; border-radius: 10px; border: none;
                    background: var(--success); color: white; display: flex;
                    align-items: center; justify-content: center; cursor: pointer;
                    transition: transform 0.2s;
                }
                .btn-download-action:hover:not(:disabled) { transform: scale(1.1); }
                .btn-download-action:disabled { background: #ccc; cursor: not-allowed; }

                .modal-footer { padding: 16px 24px; background: #fdfdfd; border-top: 1px solid #f0f0f0; }
                .secure-badge { font-size: 12px; color: #888; display: flex; align-items: center; gap: 6px; justify-content: center; }

                /* Sidebar Styles */
                .pending-section h3 { font-size: 16px; margin-bottom: 20px; }
                .pending-item { padding: 16px 0; border-bottom: 1px solid var(--border-color); }
                .pending-header { display: flex; justify-content: space-between; align-items: flex-start; width: 100%; }
                .status-actions-group { display: flex; align-items: center; gap: 10px; }
                .compact-downloads { display: flex; gap: 6px; }
                .icon-download-btn {
                    width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
                    background: #f0fdf4; border: 1px solid #b7eb8f;
                    border-radius: 8px; color: var(--success); transition: all 0.2s ease;
                }
                .icon-download-btn:hover { background: var(--success); color: white; transform: translateY(-2px); }
                .status-badge { 
                    padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; 
                    text-transform: uppercase; letter-spacing: 0.5px;
                }
                .status-badge.pending { background: #fff7e6; color: #faad14; border: 1px solid #ffe58f; }
                .status-badge.active { background: #f6ffed; color: var(--success); border: 1px solid #b7eb8f; }
                
                @media (max-width: 992px) {
                    .learning-grid { grid-template-columns: 1fr; }
                    .card-actions { margin-top: 15px; width: 100%; }
                    .btn-primary, .btn-outline-success { flex-grow: 1; justify-content: center; }
                }
            `}</style>
        </div>
    );
};

export default MyLearningPage;
