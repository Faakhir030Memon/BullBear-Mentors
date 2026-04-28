import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Award, Plus, Loader, Trash2, Download, Search, User, BookOpen } from 'lucide-react';

const AdminCertificates = () => {
    const { user: admin } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    const [formData, setFormData] = useState({
        userId: '',
        courseId: '',
        recipientName: '',
        courseTitle: '',
        completionDate: new Date().toISOString().split('T')[0],
        grade: 'Excellence'
    });

    const config = {
        headers: { Authorization: `Bearer ${admin.token}` }
    };

    const fetchData = async () => {
        try {
            const [certRes, userRes, courseRes] = await Promise.all([
                axios.get('/api/certificates', config),
                axios.get('/api/admin/users', config),
                axios.get('/api/courses')
            ]);
            setCertificates(certRes.data);
            setUsers(userRes.data);
            setCourses(courseRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUserChange = (e) => {
        const u = users.find(u => u._id === e.target.value);
        setFormData({
            ...formData,
            userId: e.target.value,
            recipientName: u ? `${u.firstName} ${u.lastName}` : ''
        });
    };

    const handleCourseChange = (e) => {
        const c = courses.find(c => c._id === e.target.value);
        setFormData({
            ...formData,
            courseId: e.target.value,
            courseTitle: c ? c.title : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/certificates', formData, config);
            setShowForm(false);
            setFormData({
                userId: '', courseId: '', recipientName: '', courseTitle: '',
                completionDate: new Date().toISOString().split('T')[0], grade: 'Excellence'
            });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to issue certificate');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`/api/certificates/${id}`, config);
                fetchData();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    if (loading) return <Loader className="animate-spin text-success" />;

    return (
        <div className="admin-certs fade-in">
            <div className="admin-header">
                <div>
                    <h2>Issued Certificates</h2>
                    <p>Manage and issue course completion certificates</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={20} /> {showForm ? 'Close Form' : 'Issue Certificate'}
                </button>
            </div>

            {showForm && (
                <div className="cert-form-container card mb-4">
                    <h3>Issue New Certificate</h3>
                    <form onSubmit={handleSubmit} className="cert-form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label><User size={14} /> Select User</label>
                                <select value={formData.userId} onChange={handleUserChange} required>
                                    <option value="">Choose User...</option>
                                    {users.map(u => (
                                        <option key={u._id} value={u._id}>{u.firstName} {u.lastName} ({u.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label><BookOpen size={14} /> Select Course</label>
                                <select value={formData.courseId} onChange={handleCourseChange} required>
                                    <option value="">Choose Course...</option>
                                    {courses.map(c => (
                                        <option key={c._id} value={c._id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Recipient Name (on certificate)</label>
                                <input 
                                    type="text" 
                                    value={formData.recipientName} 
                                    onChange={(e) => setFormData({...formData, recipientName: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Course Title (on certificate)</label>
                                <input 
                                    type="text" 
                                    value={formData.courseTitle} 
                                    onChange={(e) => setFormData({...formData, courseTitle: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Completion Date</label>
                                <input 
                                    type="date" 
                                    value={formData.completionDate} 
                                    onChange={(e) => setFormData({...formData, completionDate: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Grade/Honors</label>
                                <select 
                                    value={formData.grade} 
                                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                                >
                                    <option value="Excellence">Excellence</option>
                                    <option value="Distinction">Distinction</option>
                                    <option value="Merit">Merit</option>
                                    <option value="Completion">Completion</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-actions mt-4">
                            <button type="submit" className="btn btn-primary">
                                <Award size={18} /> Generate & Issue Certificate
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="certs-list card">
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Recipient</th>
                                <th>Course</th>
                                <th>Date</th>
                                <th>Grade</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificates.map(cert => (
                                <tr key={cert._id}>
                                    <td className="font-mono text-sm">{cert.certificateId}</td>
                                    <td>
                                        <div className="flex-col">
                                            <span className="font-bold">{cert.recipientName}</span>
                                            <span className="text-xs opacity-60">{cert.user?.email}</span>
                                        </div>
                                    </td>
                                    <td>{cert.courseTitle}</td>
                                    <td>{new Date(cert.completionDate).toLocaleDateString()}</td>
                                    <td><span className="badge-grade">{cert.grade}</span></td>
                                    <td>
                                        <div className="actions">
                                            <button className="text-danger" onClick={() => handleDelete(cert._id)} title="Revoke">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <style>{`
                .admin-certs { padding: 10px; }
                .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
                .form-group label { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-weight: 600; font-size: 14px; }
                .form-group input, .form-group select { width: 100%; padding: 12px; border: 1px solid var(--border-color); border-radius: var(--radius); }
                .admin-table { width: 100%; border-collapse: collapse; }
                .admin-table th, .admin-table td { padding: 15px; text-align: left; border-bottom: 1px solid var(--border-color); }
                .badge-grade { background: #f6ffed; color: #52c41a; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; border: 1px solid #b7eb8f; }
                .font-mono { font-family: monospace; }
                .mb-4 { margin-bottom: 24px; }
                .mt-4 { margin-top: 24px; }
                .flex-col { display: flex; flex-direction: column; }
            `}</style>
        </div>
    );
};

export default AdminCertificates;
