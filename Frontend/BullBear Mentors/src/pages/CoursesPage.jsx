import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { Search, Filter, Loader } from 'lucide-react';

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get('/api/courses');
                setCourses(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch courses');
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="loader-container">
            <Loader size={48} className="animate-spin text-success" />
        </div>
    );

    return (
        <div className="courses-page container py-5 fade-in">
            <div className="page-header">
                <div>
                    <h1>Explore Our Courses</h1>
                    <p>Select the duration that fits your learning pace and start your trading journey.</p>
                </div>
                <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="course-grid">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map(course => (
                        <CourseCard key={course._id} course={course} />
                    ))
                ) : (
                    <div className="no-results card">
                        <h3>No courses found matching "{searchTerm}"</h3>
                        <p>Try searching for something else or browse all courses.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 48px;
                }
                .page-header h1 {
                    font-size: 40px;
                    margin-bottom: 8px;
                }
                .page-header p {
                    color: var(--text-secondary);
                    font-size: 18px;
                }
                .search-bar {
                    position: relative;
                    width: 300px;
                }
                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #999;
                }
                .search-bar input {
                    width: 100%;
                    padding: 12px 12px 12px 40px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius);
                    font-size: 14px;
                }
                .course-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 30px;
                }
                .no-results {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 80px;
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .loader-container {
                    height: 60vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @media (max-width: 768px) {
                    .page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }
                    .search-bar {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default CoursesPage;
