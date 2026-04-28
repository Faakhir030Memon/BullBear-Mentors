import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Calendar, Book, Shield, AlertCircle, CheckCircle, Camera, Award, Download, Eye, Loader } from 'lucide-react';
import axios from 'axios';
import CertificateTemplate from '../components/CertificateTemplate';

const ProfilePage = () => {
    const { user, updateProfile, loading, error } = useAuth();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        password: '',
        confirmPassword: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [validationError, setValidationError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [certificates, setCertificates] = useState([]);
    const [loadingCerts, setLoadingCerts] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);

    const fetchCertificates = async () => {
        try {
            const { data } = await axios.get('/api/certificates/my', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setCertificates(data);
            setLoadingCerts(false);
        } catch (err) {
            console.error(err);
            setLoadingCerts(false);
        }
    };

    useState(() => {
        if (user) fetchCertificates();
    }, [user]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const { data } = await axios.post('/api/auth/profile/pic', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`
                }
            });
            setSuccessMessage(data.message);
            // In a real app, we'd update the local user context here
            // user.profilePicture = data.profilePicture;
            setUploading(false);
        } catch (err) {
            setValidationError('Failed to upload image');
            setUploading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setValidationError('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            return setValidationError('Passwords do not match');
        }

        const updateData = {
            firstName: formData.firstName,
            lastName: formData.lastName
        };
        if (formData.password) {
            updateData.password = formData.password;
        }

        const success = await updateProfile(updateData);
        if (success) {
            setSuccessMessage('Profile updated successfully!');
            setFormData({ ...formData, password: '', confirmPassword: '' });
        }
    };

    return (
        <div className="profile-page container fade-in">
            <div className="profile-grid">
                {/* Profile Sidebar */}
                <div className="profile-sidebar">
                    <div className="user-card card">
                        <div className="avatar-container">
                            <div className="avatar">
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="Avatar" />
                                ) : (
                                    <span>{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
                                )}
                            </div>
                            <label htmlFor="pic-upload" className="upload-btn">
                                {uploading ? <Loader className="animate-spin" size={16} /> : <Camera size={16} />}
                            </label>
                            <input type="file" id="pic-upload" hidden onChange={handleFileUpload} accept="image/*" />
                        </div>
                        <h3>{user?.firstName} {user?.lastName}</h3>
                        <p>{user?.email}</p>
                        <div className="user-status-badges">
                            <div className="user-badge">
                                {user?.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                                {user?.role?.toUpperCase()}
                            </div>
                            {user?.profilePicStatus && (
                                <div className={`pic-status ${user.profilePicStatus}`}>
                                    {user.profilePicStatus === 'pending' ? 'Pic Pending' : user.profilePicStatus === 'approved' ? 'Pic Approved' : 'Pic Rejected'}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="stats-list card">
                        <div className="stat-item">
                            <Book size={20} />
                            <span>My Courses: 0</span>
                        </div>
                        <div className="stat-item">
                            <Calendar size={20} />
                            <span>Member Since: {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Profile Settings */}
                <div className="profile-main">
                    <div className="card">
                        <h2>Profile Settings</h2>
                        <p className="subtitle">Update your personal information and security settings</p>
                        
                        {/* Certificates Section */}
                        <div className="certs-section mb-5">
                            <h3>My Certificates</h3>
                            {loadingCerts ? <Loader className="animate-spin text-success" /> : (
                                <div className="certs-list-mini">
                                    {certificates.length === 0 ? (
                                        <p className="text-muted">No certificates issued yet.</p>
                                    ) : (
                                        certificates.map(c => (
                                            <div key={c._id} className="cert-item-mini">
                                                <div className="cert-icon-mini"><Award size={24} /></div>
                                                <div className="cert-info-mini">
                                                    <h4>{c.courseTitle}</h4>
                                                    <span>Issued: {new Date(c.completionDate).toLocaleDateString()}</span>
                                                </div>
                                                <div className="cert-actions-mini">
                                                    <button className="btn btn-outline btn-sm" onClick={() => setSelectedCert(c)}>
                                                        <Eye size={16} /> View
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {selectedCert && (
                            <div className="modal-overlay" onClick={() => setSelectedCert(null)}>
                                <div className="modal-content" onClick={e => e.stopPropagation()}>
                                    <div className="modal-header">
                                        <h3>Certificate Preview</h3>
                                        <div className="modal-btns">
                                            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
                                                <Download size={16} /> Download / Print
                                            </button>
                                            <button className="close-btn" onClick={() => setSelectedCert(null)}>&times;</button>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <CertificateTemplate cert={selectedCert} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {successMessage && (
                            <div className="alert alert-success">
                                <CheckCircle size={20} />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {(error || validationError) && (
                            <div className="alert alert-danger">
                                <AlertCircle size={20} />
                                <span>{error || validationError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-section">
                                <h3>Personal Information</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="firstName">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3>Security</h3>
                                <p className="section-note">Leave password fields empty if you don't want to change it</p>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="password">New Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirmPassword">Confirm New Password</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

                .avatar-container { position: relative; width: 100px; height: 100px; margin: 0 auto 20px; }
                .avatar { width: 100%; height: 100%; background-color: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 700; overflow: hidden; }
                .avatar img { width: 100%; height: 100%; object-fit: cover; }
                .upload-btn { position: absolute; bottom: 0; right: 0; background: var(--success); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid white; box-shadow: var(--shadow-sm); }
                .user-status-badges { display: flex; flex-direction: column; align-items: center; gap: 8px; }
                .pic-status { font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; }
                .pic-status.pending { background: #fff7e6; color: #faad14; }
                .pic-status.approved { background: #f6ffed; color: #52c41a; }
                .pic-status.rejected { background: #fff1f0; color: #f5222d; }
                
                .certs-section { margin-bottom: 40px; background: #f9f9f9; padding: 20px; border-radius: var(--radius); }
                .cert-item-mini { display: flex; align-items: center; gap: 15px; padding: 15px; background: white; border-radius: 8px; margin-bottom: 10px; box-shadow: var(--shadow-sm); }
                .cert-icon-mini { color: var(--success); }
                .cert-info-mini h4 { margin: 0; font-size: 16px; }
                .cert-info-mini span { font-size: 12px; color: var(--text-secondary); }
                .cert-actions-mini { margin-left: auto; }

                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
                .modal-content { background: white; border-radius: 8px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; }
                .modal-header { padding: 20px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: white; z-index: 2; }
                .modal-btns { display: flex; align-items: center; gap: 15px; }
                .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
                .modal-body { padding: 20px; display: flex; justify-content: center; }

                .mb-5 { margin-bottom: 48px; }
                .text-muted { color: #888; }

                .profile-page { padding: 60px 20px; }
                .profile-grid { display: grid; grid-template-columns: 350px 1fr; gap: 30px; }
                .profile-sidebar { display: flex; flex-direction: column; gap: 20px; }
                .user-card { text-align: center; padding: 40px 24px; }
                .user-card h3 { margin-bottom: 4px; }
                .user-card p { color: var(--text-secondary); font-size: 14px; margin-bottom: 20px; }
                .user-badge { display: inline-flex; align-items: center; gap: 6px; background-color: #f1f1f1; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
                .stats-list { padding: 24px; }
                .stat-item { display: flex; align-items: center; gap: 15px; padding: 12px 0; color: var(--text-secondary); }
                .stat-item:not(:last-child) { border-bottom: 1px solid var(--border-color); }
                .profile-main .card { padding: 40px; }
                .subtitle { color: var(--text-secondary); margin-bottom: 40px; }
                .form-section { margin-bottom: 40px; }
                .form-section h3 { font-size: 18px; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--bg-secondary); }
                .section-note { font-size: 13px; color: var(--text-secondary); margin-bottom: 20px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; font-weight: 600; font-size: 14px; margin-bottom: 8px; }
                .form-group input { width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); font-size: 16px; }
                .alert { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: var(--radius); margin-bottom: 32px; font-size: 14px; }
                .alert-success { background-color: #f6ffed; border: 1px solid #b7eb8f; color: var(--success); }
                .alert-danger { background-color: #fff1f0; border: 1px solid #ffa39e; color: var(--danger); }
                @media (max-width: 992px) { .profile-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
};

export default ProfilePage;
