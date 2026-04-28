import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Check, X, CreditCard, ExternalLink, Loader } from 'lucide-react';

const AdminPayments = () => {
    const { user } = useAuth();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const fetchPurchases = async () => {
        try {
            const { data } = await axios.get('/api/purchase', config);
            setPurchases(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    const handleVerify = async (id, status) => {
        try {
            await axios.put(`/api/purchase/${id}/verify`, { status }, config);
            fetchPurchases();
        } catch (err) {
            alert('Failed to verify payment');
        }
    };

    if (loading) return <Loader className="animate-spin text-success" />;

    return (
        <div className="admin-payments fade-in">
            <div className="admin-header">
                <h2>Payment Verification</h2>
                <p>Pending: {purchases.filter(p => p.status === 'pending').length}</p>
            </div>

            <div className="payments-table card">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Course</th>
                            <th>Trans ID</th>
                            <th>Amount</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map(p => (
                            <tr key={p._id}>
                                <td>
                                    <div className="user-info">
                                        <strong>{p.user?.firstName} {p.user?.lastName}</strong>
                                        <span className="email">{p.user?.email}</span>
                                    </div>
                                </td>
                                <td>{p.course?.title}</td>
                                <td><code className="trans-id">{p.transactionId}</code></td>
                                <td>{p.amount.toLocaleString()} PKR</td>
                                <td>{p.duration} Month(s)</td>
                                <td>
                                    <span className={`status-badge ${p.status}`}>
                                        {p.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    {p.status === 'pending' && (
                                        <div className="actions">
                                            <button className="verify-btn" onClick={() => handleVerify(p._id, 'active')}>
                                                <Check size={16} /> Verify
                                            </button>
                                            <button className="reject-btn" onClick={() => handleVerify(p._id, 'rejected')}>
                                                <X size={16} /> Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .admin-header { margin-bottom: 24px; }
                .user-info { display: flex; flex-direction: column; }
                .email { font-size: 12px; color: var(--text-secondary); }
                .trans-id { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { text-align: left; padding: 15px; border-bottom: 1px solid var(--border-color); font-size: 14px; }
                .status-badge { padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; }
                .status-badge.active { background: #f6ffed; color: var(--success); }
                .status-badge.pending { background: #fff7e6; color: #faad14; }
                .status-badge.rejected { background: #fff1f0; color: var(--danger); }
                .actions { display: flex; gap: 8px; }
                .verify-btn, .reject-btn {
                    display: flex; align-items: center; gap: 4px; padding: 6px 12px;
                    border-radius: 4px; border: none; cursor: pointer; font-size: 12px; font-weight: 600;
                }
                .verify-btn { background: var(--success); color: white; }
                .reject-btn { background: var(--danger); color: white; }
            `}</style>
        </div>
    );
};

export default AdminPayments;
