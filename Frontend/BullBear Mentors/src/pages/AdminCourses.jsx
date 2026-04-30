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
        category: 'Premium',
        prices: {
            oneMonth: 30000,
            sixMonth: 153000,
            twelveMonth: 270000
        }
    });
    const [uploading, setUploading] = useState(false);
    const [newMaterial, setNewMaterial] = useState({ title: '', description: '', file: null });

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

    const handleEdit = async (course) => {
        try {
            const { data } = await axios.get(`/api/courses/${course._id}`, config);
            setFormData({
                _id: data._id,
                title: data.title,
                description: data.description,
                image: data.image,
                category: data.category || 'Premium',
                prices: data.prices,
                content: data.content || [],
                isActive: data.isActive
            });
            setIsAdding(true);
            window.scrollTo(0, 0);
        } catch (err) {
            alert('Failed to fetch course details');
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            if (formData._id) {
                await axios.put(`/api/courses/${formData._id}`, formData, config);
            } else {
                await axios.post('/api/courses', formData, config);
            }
            setIsAdding(false);
            setFormData({
                title: '', description: '', image: '', category: 'Premium',
                prices: { oneMonth: 30000, sixMonth: 153000, twelveMonth: 270000 }
            });
            fetchCourses();
        } catch (err) {
            alert('Failed to save course');
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
                <button className="btn btn-primary" onClick={() => {
                    setIsAdding(!isAdding);
                    if (!isAdding) {
                        setFormData({
                            title: '', description: '', image: '', category: 'Premium',
                            prices: { oneMonth: 30000, sixMonth: 153000, twelveMonth: 270000 }
                        });
                    }
                }}>
                    {isAdding ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add New Course</>}
                </button>
            </div>

            {isAdding && (
                <div className="add-course-form card mb-4">
                    <h3>{formData._id ? 'Edit Course' : 'Add New Course'}</h3>
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
                        <div className="form-row">
                            <div className="form-group">
                                <label>Image URL</label>
                                <input 
                                    type="text" 
                                    value={formData.image} 
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select 
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    style={{width: '100%', padding: '10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)'}}
                                >
                                    <option value="Normal">Normal Course</option>
                                    <option value="Premium">Premium Course</option>
                                </select>
                            </div>
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
                        
                        <div className="content-manager mb-4 mt-4 p-3" style={{border: '1px solid #ddd', borderRadius: '8px'}}>
                            <h4>Course Material (Videos, PDFs, Docs)</h4>
                            {formData.content && formData.content.map((item, index) => (
                                <div key={index} style={{display:'flex', gap:'10px', marginBottom:'10px', alignItems:'center'}}>
                                    <input type="text" placeholder="Title" value={item.title} onChange={e => {
                                        const newContent = [...formData.content];
                                        newContent[index].title = e.target.value;
                                        setFormData({...formData, content: newContent});
                                    }} style={{flex: 1}} />
                                    <input type="text" placeholder="Description" value={item.description} onChange={e => {
                                        const newContent = [...formData.content];
                                        newContent[index].description = e.target.value;
                                        setFormData({...formData, content: newContent});
                                    }} style={{flex: 1}} />
                                    <a href={item.fileUrl} target="_blank" rel="noreferrer" style={{fontSize: '12px', whiteSpace:'nowrap', color: 'var(--success)'}}>View File</a>
                                    <button type="button" className="text-danger" onClick={() => {
                                        const newContent = [...formData.content];
                                        newContent.splice(index, 1);
                                        setFormData({...formData, content: newContent});
                                    }} style={{background:'none', border:'none', cursor:'pointer'}}><Trash2 size={16} /></button>
                                </div>
                            ))}
                            
                            <div style={{display:'flex', gap:'10px', marginTop:'15px', alignItems:'flex-end', background: '#f9f9f9', padding: '15px', borderRadius: '8px'}}>
                                <div style={{flex: 1}}>
                                    <label style={{fontSize:'12px', fontWeight: '600'}}>Item Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Chapter 1 Video" 
                                        value={newMaterial.title}
                                        onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                                    />
                                </div>
                                <div style={{flex: 1}}>
                                    <label style={{fontSize:'12px', fontWeight: '600'}}>Item Description</label>
                                    <input 
                                        type="text" 
                                        placeholder="Brief description" 
                                        value={newMaterial.description}
                                        onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                                    />
                                </div>
                                <div style={{flex: 1}}>
                                    <label style={{fontSize:'12px', fontWeight: '600'}}>Upload File</label>
                                    <input 
                                        type="file" 
                                        onChange={(e) => setNewMaterial({...newMaterial, file: e.target.files[0]})}
                                    />
                                </div>
                                <button 
                                    type="button" 
                                    className="btn btn-primary" 
                                    disabled={uploading}
                                    onClick={async () => {
                                        if (!newMaterial.title || !newMaterial.file) {
                                            return alert('Title and File are required');
                                        }
                                        
                                        setUploading(true);
                                        const fileData = new FormData();
                                        fileData.append('file', newMaterial.file);
                                        
                                        try {
                                            const res = await axios.post('/api/upload', fileData, config);
                                            const newContentItem = {
                                                title: newMaterial.title,
                                                description: newMaterial.description,
                                                fileUrl: res.data.url,
                                                fileType: res.data.type
                                            };
                                            setFormData({...formData, content: [...(formData.content || []), newContentItem]});
                                            setNewMaterial({ title: '', description: '', file: null });
                                            alert('Material added successfully!');
                                        } catch (err) {
                                            console.error(err);
                                            alert(err.response?.data?.message || 'File upload failed');
                                        } finally {
                                            setUploading(false);
                                        }
                                    }}
                                >
                                    {uploading ? 'Uploading...' : 'Add Material'}
                                </button>
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
                                        <button className="text-primary" onClick={() => handleEdit(course)}><Edit size={18} /></button>
                                        <button className="text-danger" onClick={() => handleDelete(course._id)}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
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
