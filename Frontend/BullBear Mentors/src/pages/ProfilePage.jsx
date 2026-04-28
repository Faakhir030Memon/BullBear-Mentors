import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Calendar, Book, Shield, AlertCircle, CheckCircle } from 'lucide-react';

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
                        <div className="avatar">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <h3>{user?.firstName} {user?.lastName}</h3>
                        <p>{user?.email}</p>
                        <div className="user-badge">
                            {user?.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                            {user?.role?.toUpperCase()}
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

            <style>{`
                .profile-page {
                    padding: 60px 20px;
                }
                .profile-grid {
                    display: grid;
                    grid-template-columns: 350px 1fr;
                    gap: 30px;
                }
                .profile-sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .user-card {
                    text-align: center;
                    padding: 40px 24px;
                }
                .avatar {
                    width: 100px;
                    height: 100px;
                    background-color: var(--primary);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 36px;
                    font-weight: 700;
                    margin: 0 auto 20px;
                }
                .user-card h3 {
                    margin-bottom: 4px;
                }
                .user-card p {
                    color: var(--text-secondary);
                    font-size: 14px;
                    margin-bottom: 20px;
                }
                .user-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background-color: #f1f1f1;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                }
                .stats-list {
                    padding: 24px;
                }
                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 12px 0;
                    color: var(--text-secondary);
                }
                .stat-item:not(:last-child) {
                    border-bottom: 1px solid var(--border-color);
                }
                .profile-main .card {
                    padding: 40px;
                }
                .subtitle {
                    color: var(--text-secondary);
                    margin-bottom: 40px;
                }
                .form-section {
                    margin-bottom: 40px;
                }
                .form-section h3 {
                    font-size: 18px;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid var(--bg-secondary);
                }
                .section-note {
                    font-size: 13px;
                    color: var(--text-secondary);
                    margin-bottom: 20px;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-group label {
                    display: block;
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
                .form-group input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius);
                    font-size: 16px;
                }
                .alert {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                    border-radius: var(--radius);
                    margin-bottom: 32px;
                    font-size: 14px;
                }
                .alert-success {
                    background-color: #f6ffed;
                    border: 1px solid #b7eb8f;
                    color: var(--success);
                }
                .alert-danger {
                    background-color: #fff1f0;
                    border: 1px solid #ffa39e;
                    color: var(--danger);
                }
                @media (max-width: 992px) {
                    .profile-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;
