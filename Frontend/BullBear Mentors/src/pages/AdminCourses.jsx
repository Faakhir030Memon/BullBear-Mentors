import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Check, X, Loader } from 'lucide-react';

const AdminCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        prices: {
            oneMonth: 30000,
            sixMonth: 153000,
            twelveMonth: 270000
        }
    });

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get('/api/courses');
            setCourses(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/courses', formData, config);
            setIsAdding(false);
            setFormData({
                title: '', description: '', image: '',
                prices: { oneMonth: 30000, sixMonth: 153000, twelveMonth: 270000 }
            });
            fetchCourses();
        } catch (err) {
            alert('Failed to add course');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(`/api/courses/${id}`, config);
                fetchCourses();
            } catch (err) {
                alert('Failed to delete course');
            }
        }
    };

    if (loading) return <Loader className="animate-spin text-success" />;

    return (
        <div className="admin-courses fade-in">
            <div className="admin-header">
                <h2>Manage Courses</h2>
                <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add New Course</>}
                </button>
            </div>

            {isAdding && (
                <div className="add-course-form card mb-4">
                    <h3>Add New Course</h3>
                    <form onSubmit={handleAddCourse}>
                        <div className="form-group">
                            <label>Title</label>
                            <input 
                                type="text" 
                                value={formData.title} 
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea 
                                value={formData.description} 
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input 
                                type="text" 
                                value={formData.image} 
                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>1 Month Price</label>
                                <input 
                                    type="number" 
                                    value={formData.prices.oneMonth} 
                                    onChange={(e) => setFormData({...formData, prices: {...formData.prices, oneMonth: e.target.value}})}
                                />
                            </div>
                            <div className="form-group">
                                <label>6 Month Price</label>
                                <input 
                                    type="number" 
                                    value={formData.prices.sixMonth} 
                                    onChange={(e) => setFormData({...formData, prices: {...formData.prices, sixMonth: e.target.value}})}
                                />
                            </div>
                            <div className="form-group">
                                <label>12 Month Price</label>
                                <input 
                                    type="number" 
                                    value={formData.prices.twelveMonth} 
                                    onChange={(e) => setFormData({...formData, prices: {...formData.prices, twelveMonth: e.target.value}})}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-success">Save Course</button>
                    </form>
                </div>
            )}

            <div className="courses-table card">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Prices (1M/6M/12M)</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course._id}>
                                <td><img src={course.image || 'https://via.placeholder.com/50'} alt="" width="50" height="30" /></td>
                                <td>{course.title}</td>
                                <td>{course.prices.oneMonth}/{course.prices.sixMonth}/{course.prices.twelveMonth}</td>
                                <td>
                                    <span className={`badge ${course.isActive ? 'badge-success' : 'badge-danger'}`}>
                                        {course.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="actions">
                                        <button className="text-primary"><Edit size={18} /></button>
                                        <button className="text-danger" onClick={() => handleDelete(course._id)}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 15px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-size: 14px;
                }
                .form-group input, .form-group textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius);
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    text-align: left;
                    padding: 15px;
                    border-bottom: 1px solid var(--border-color);
                }
                .badge {
                    padding: 4px 8px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                }
                .badge-success { background: #e6f7e6; color: var(--success); }
                .badge-danger { background: #fff1f0; color: var(--danger); }
                .actions {
                    display: flex;
                    gap: 10px;
                }
                .actions button {
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                .mb-4 { margin-bottom: 1.5rem; }
            `}</style>
        </div>
    );
};

export default AdminCourses;
