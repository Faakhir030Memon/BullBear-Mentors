import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Video, Plus, Trash2, Calendar, Clock, Loader, ExternalLink } from 'lucide-react';

const AdminSessions = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        zoomLink: '',
        startTime: '',
        duration: 60,
        courseId: ''
    });

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const fetchData = async () => {
        try {
            const [sessionRes, courseRes] = await Promise.all([
                axios.get('/api/sessions', config),
                axios.get('/api/courses', config)
            ]);
            setSessions(sessionRes.data);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/sessions', formData, config);
            setShowForm(false);
            setFormData({ title: '', description: '', zoomLink: '', startTime: '', duration: 60, courseId: '' });
            fetchData();
            alert('Live session scheduled!');
        } catch (err) {
            alert('Failed to schedule session');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this session?')) {
            try {
                await axios.delete(`/api/sessions/${id}`, config);
                fetchData();
            } catch (err) {
                alert('Failed to delete session');
            }
        }
    };

    if (loading) return <div className="p-5 text-center"><Loader className="animate-spin text-success" /></div>;

    return (
        <div className="admin-sessions fade-in">
            <div className="admin-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Live Sessions Management</h2>
                    <p>Schedule Zoom meetings for specific courses.</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : <><Plus size={18} /> Schedule New Session</>}
                </button>
            </div>

            {showForm && (
                <div className="card p-4 mb-5 shadow-sm">
                    <h3>Schedule Zoom Session</h3>
                    <form onSubmit={handleSubmit} className="mt-3">
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Session Title</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g. Weekly Live Q&A"
                                />
                            </div>
                            <div className="form-group">
                                <label>Target Course</label>
                                <select 
                                    required 
                                    value={formData.courseId}
                                    onChange={e => setFormData({...formData, courseId: e.target.value})}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Zoom Link</label>
                                <input 
                                    type="url" 
                                    required 
                                    value={formData.zoomLink}
                                    onChange={e => setFormData({...formData, zoomLink: e.target.value})}
                                    placeholder="https://zoom.us/j/..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Start Time</label>
                                <input 
                                    type="datetime-local" 
                                    required 
                                    value={formData.startTime}
                                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Duration (minutes)</label>
                                <input 
                                    type="number" 
                                    required 
                                    value={formData.duration}
                                    onChange={e => setFormData({...formData, duration: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="form-group mt-3">
                            <label>Description</label>
                            <textarea 
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                placeholder="What will be covered in this session?"
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-success mt-3">Create Session</button>
                    </form>
                </div>
            )}

            <div className="sessions-table card">
                <table>
                    <thead>
                        <tr>
                            <th>Session</th>
                            <th>Course</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map(s => (
                            <tr key={s._id}>
                                <td>
                                    <div className="d-flex flex-direction-column">
                                        <strong>{s.title}</strong>
                                        <a href={s.zoomLink} target="_blank" rel="noreferrer" className="text-primary small d-flex align-items-center gap-1">
                                            <ExternalLink size={12} /> Join Link
                                        </a>
                                    </div>
                                </td>
                                <td>{s.course?.title}</td>
                                <td>
                                    <div className="small">
                                        <Calendar size={12} /> {new Date(s.startTime).toLocaleDateString()}
                                        <br />
                                        <Clock size={12} /> {new Date(s.startTime).toLocaleTimeString()}
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${s.status}`}>{s.status}</span>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(s._id)} className="text-danger" style={{background:'none', border:'none', cursor:'pointer'}}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {sessions.length === 0 && <tr><td colSpan="5" className="text-center p-5 text-secondary">No sessions scheduled yet.</td></tr>}
                    </tbody>
                </table>
            </div>

            <style>{`
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
                .form-group label { display: block; margin-bottom: 5px; font-size: 13px; font-weight: 600; }
                input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
                .status-badge.scheduled { background: #e6f7ff; color: #1890ff; }
                .status-badge.live { background: #fff1f0; color: #f5222d; }
                .status-badge.ended { background: #f5f5f5; color: #8c8c8c; }
            `}</style>
        </div>
    );
};

export default AdminSessions;
