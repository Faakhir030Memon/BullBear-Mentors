import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, User, LogOut, BookOpen, Home, Info, Shield } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-logo">
                    <TrendingUp size={24} className="text-success" />
                    <span>BullBear Mentors</span>
                </Link>

                <div className="nav-links">
                    <Link to="/" className="nav-link"><Home size={18} /> Home</Link>
                    <Link to="/courses" className="nav-link"><BookOpen size={18} /> Courses</Link>
                    <Link to="/my-learning" className="nav-link"><PlayCircle size={18} /> My Learning</Link>
                    <Link to="/about" className="nav-link"><Info size={18} /> About</Link>
                    {user.role === 'admin' && (
                        <Link to="/admin" className="nav-link text-danger"><Shield size={18} /> Admin</Link>
                    )}
                </div>

                <div className="nav-actions">
                    <Link to="/profile" className="nav-user">
                        <User size={18} />
                        <span>{user.firstName}</span>
                    </Link>
                    <button onClick={handleLogout} className="logout-btn" title="Logout">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            <style jsx>{`
                .navbar {
                    height: 70px;
                    background-color: white;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }
                .nav-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }
                .nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 20px;
                    font-weight: 800;
                    color: var(--primary);
                }
                .nav-links {
                    display: flex;
                    gap: 30px;
                }
                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 500;
                    color: var(--text-secondary);
                    transition: var(--transition);
                }
                .nav-link:hover {
                    color: var(--primary);
                }
                .nav-actions {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .nav-user {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background-color: var(--bg-secondary);
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 14px;
                }
                .logout-btn {
                    background: none;
                    color: var(--text-secondary);
                    padding: 5px;
                    transition: var(--transition);
                }
                .logout-btn:hover {
                    color: var(--danger);
                }
                @media (max-width: 768px) {
                    .nav-links {
                        display: none;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
