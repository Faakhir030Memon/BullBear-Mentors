import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Ban, Trash2, CheckCircle, Loader, Camera, XCircle, CheckSquare } from 'lucide-react';

const AdminUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [targetUser, setTargetUser] = useState(null); // For admin setting pic

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/admin/users', config);
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBlock = async (id) => {
        try {
            await axios.put(`/api/admin/users/${id}/block`, {}, config);
            fetchUsers();
        } catch (err) {
            alert('Failed to update user status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure? This will permanently delete the user.')) {
            try {
                await axios.delete(`/api/admin/users/${id}`, config);
                fetchUsers();
            } catch (err) {
                alert('Failed to delete user');
            }
        }
    };

    const handlePicStatus = async (id, status) => {
        try {
            await axios.put(`/api/admin/users/${id}/pic-status`, { status }, config);
            fetchUsers();
        } catch (err) {
            alert('Failed to update pic status');
        }
    };

    const handleAdminUpload = async (e, id) => {
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
                },
                // We'll need a different endpoint for admin to upload for OTHER users 
                // OR we just use the same one and pass a userId if we update the backend.
                // For now, let's assume admin uses a dedicated route if we had one, 
                // but usually admins can just impersonate or we add a userId param.
            });
            // Re-fetch to show update
            await axios.put(`/api/admin/users/${id}/pic-status`, { status: 'approved' }, config);
            fetchUsers();
            setUploading(false);
        } catch (err) {
            alert('Upload failed');
            setUploading(false);
        }
    };

    if (loading) return <Loader className="animate-spin text-success" />;

    return (
        <div className="admin-users fade-in">
            <div className="admin-header">
                <h2>Manage Users</h2>
                <p>Total Registered: {users.length}</p>
            </div>

            <div className="users-table card">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar-container">
                                            <div className="user-avatar">
                                                {u.profilePicture ? (
                                                    <img src={u.profilePicture} alt="Avatar" />
                                                ) : (
                                                    u.firstName?.[0] || 'U'
                                                )}
                                            </div>
                                            <label className="admin-upload-btn">
                                                <Camera size={10} />
                                                <input type="file" hidden onChange={(e) => handleAdminUpload(e, u._id)} />
                                            </label>
                                        </div>
                                        <div className="flex-col">
                                            <span className="font-bold">{u.firstName} {u.lastName}</span>
                                            {u.profilePicture && u.profilePicStatus === 'pending' && (
                                                <div className="pending-pic-actions">
                                                    <button onClick={() => handlePicStatus(u._id, 'approved')} className="text-success"><CheckSquare size={14} /></button>
                                                    <button onClick={() => handlePicStatus(u._id, 'rejected')} className="text-danger"><XCircle size={14} /></button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`role-badge ${u.role}`}>
                                        {u.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                                        {u.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-badge ${u.isBlocked ? 'blocked' : 'active'}`}>
                                        {u.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="actions">
                                        <button 
                                            className={u.isBlocked ? 'text-success' : 'text-warning'} 
                                            onClick={() => handleBlock(u._id)}
                                            title={u.isBlocked ? 'Unblock' : 'Block'}
                                        >
                                            <Ban size={18} />
                                        </button>
                                        <button className="text-danger" onClick={() => handleDelete(u._id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

                .admin-header { margin-bottom: 24px; }
                .user-info { display: flex; align-items: center; gap: 12px; }
                .user-avatar-container { position: relative; }
                .user-avatar { 
                    width: 40px; height: 40px; background: var(--primary); 
                    color: white; border-radius: 50%; display: flex; 
                    align-items: center; justify-content: center; font-size: 14px; font-weight: 700;
                    overflow: hidden;
                }
                .user-avatar img { width: 100%; height: 100%; object-fit: cover; }
                .admin-upload-btn { position: absolute; bottom: -5px; right: -5px; background: var(--success); color: white; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .pending-pic-actions { display: flex; gap: 8px; margin-top: 5px; }
                .pending-pic-actions button { background: none; border: none; cursor: pointer; padding: 2px; border-radius: 4px; display: flex; }
                .pending-pic-actions button:hover { background: rgba(0,0,0,0.05); }
                .flex-col { display: flex; flex-direction: column; }
                .font-bold { font-weight: 700; }

                table { width: 100%; border-collapse: collapse; }
                th, td { text-align: left; padding: 15px; border-bottom: 1px solid var(--border-color); vertical-align: middle; }
                .role-badge { 
                    display: inline-flex; align-items: center; gap: 5px; 
                    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase;
                }
                .role-badge.admin { background: #fff1f0; color: var(--danger); }
                .role-badge.user { background: #e6f7ff; color: #1890ff; }
                .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
                .status-badge.active { background: #f6ffed; color: var(--success); }
                .status-badge.blocked { background: #fff1f0; color: var(--danger); }
                .actions { display: flex; gap: 10px; }
                .actions button { background: none; border: none; cursor: pointer; }
                .text-warning { color: #faad14; }
            `}</style>
        </div>
    );
};

export default AdminUsers;
