import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, User, Ban, Trash2, CheckCircle, Loader } from 'lucide-react';

const AdminUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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
                                        <div className="user-avatar">{u.firstName[0]}</div>
                                        <span>{u.firstName} {u.lastName}</span>
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

            <style jsx>{`
                .admin-header { margin-bottom: 24px; }
                .user-info { display: flex; align-items: center; gap: 10px; }
                .user-avatar { 
                    width: 32px; height: 32px; background: var(--primary); 
                    color: white; border-radius: 50%; display: flex; 
                    align-items: center; justify-content: center; font-size: 12px; font-weight: 700;
                }
                table { width: 100%; border-collapse: collapse; }
                th, td { text-align: left; padding: 15px; border-bottom: 1px solid var(--border-color); }
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
