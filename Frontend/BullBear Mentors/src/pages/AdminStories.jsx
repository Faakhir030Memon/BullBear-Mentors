import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit, Plus, Loader, Image as ImageIcon } from 'lucide-react';

const AdminStories = () => {
    const { user } = useAuth();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentStory, setCurrentStory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: '',
        type: 'story'
    });

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const fetchStories = async () => {
        try {
            const { data } = await axios.get('/api/stories');
            setStories(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`/api/stories/${currentStory._id}`, formData, config);
            } else {
                await axios.post('/api/stories', formData, config);
            }
            setIsEditing(false);
            setCurrentStory(null);
            setFormData({ name: '', description: '', image: '', type: 'story' });
            fetchStories();
        } catch (err) {
            alert('Operation failed');
        }
    };

    const handleEdit = (story) => {
        setIsEditing(true);
        setCurrentStory(story);
        setFormData({
            name: story.name,
            description: story.description,
            image: story.image,
            type: story.type
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`/api/stories/${id}`, config);
                fetchStories();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    if (loading) return <Loader className="animate-spin text-success" />;

    return (
        <div className="admin-stories fade-in">
            <div className="admin-header">
                <h2>Manage Success Stories</h2>
                <button className="btn btn-primary btn-sm" onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: '', description: '', image: '', type: 'story' });
                }}>
                    <Plus size={16} /> Add New Story
                </button>
            </div>

            <div className="admin-grid-layout">
                <div className="form-container card">
                    <h3>{isEditing ? 'Edit Story' : 'Add New Story'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="story">Success Story</option>
                                <option value="certificate">Featured Certificate</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Image URL</label>
                            <input type="text" name="image" value={formData.image} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Description / Review</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-full">
                            {isEditing ? 'Update Story' : 'Create Story'}
                        </button>
                    </form>
                </div>

                <div className="list-container">
                    {stories.map(s => (
                        <div key={s._id} className="story-item card">
                            <div className="story-img-preview" style={{ backgroundImage: `url(${s.image})` }}>
                                {!s.image && <ImageIcon size={32} opacity={0.3} />}
                            </div>
                            <div className="story-content">
                                <div className="story-meta">
                                    <span className={`type-tag ${s.type}`}>{s.type}</span>
                                    <h4>{s.name}</h4>
                                </div>
                                <p>{s.description.substring(0, 80)}...</p>
                                <div className="story-actions">
                                    <button onClick={() => handleEdit(s)} className="text-primary"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(s._id)} className="text-danger"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .admin-grid-layout { display: grid; grid-template-columns: 400px 1fr; gap: 30px; }
                .form-group { margin-bottom: 20px; }
                .form-group label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 14px; }
                .form-group input, .form-group select, .form-group textarea { 
                    width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: var(--radius); 
                }
                .w-full { width: 100%; }
                .list-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
                .story-item { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
                .story-img-preview { height: 150px; background-size: cover; background-position: center; background-color: #f1f1f1; display: flex; align-items: center; justify-content: center; }
                .story-content { padding: 16px; }
                .story-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
                .type-tag { font-size: 10px; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; font-weight: 700; }
                .type-tag.story { background: #e6f7ff; color: #1890ff; }
                .type-tag.certificate { background: #f6ffed; color: #52c41a; }
                .story-actions { display: flex; gap: 15px; margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; }
                .story-actions button { background: none; border: none; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default AdminStories;
