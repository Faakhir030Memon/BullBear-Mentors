import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
    Users, 
    BookOpen, 
    CreditCard, 
    BarChart2, 
    Award, 
    Settings,
    ChevronRight,
    TrendingUp
} from 'lucide-react';

// Admin Sub-pages
const AdminStats = () => <div className="admin-content card"><h2>Overview Stats Coming Soon</h2></div>;
const AdminUsers = () => <div className="admin-content card"><h2>User Management Coming Soon</h2></div>;
const AdminCourses = () => <div className="admin-content card"><h2>Course Management Coming Soon</h2></div>;
const AdminPayments = () => <div className="admin-content card"><h2>Payment Verification Coming Soon</h2></div>;

const AdminDashboard = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: <BarChart2 size={20} />, label: 'Overview', exact: true },
        { path: '/admin/courses', icon: <BookOpen size={20} />, label: 'Manage Courses' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Manage Users' },
        { path: '/admin/payments', icon: <CreditCard size={20} />, label: 'Payments' },
        { path: '/admin/stories', icon: <Award size={20} />, label: 'Success Stories' },
    ];

    return (
        <div className="admin-dashboard container py-5 fade-in">
            <div className="admin-grid">
                {/* Admin Sidebar */}
                <aside className="admin-sidebar">
                    <div className="admin-logo">
                        <TrendingUp className="text-success" />
                        <span>Admin Panel</span>
                    </div>
                    <nav className="admin-nav">
                        {menuItems.map(item => (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                className={`admin-nav-item ${
                                    (item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)) 
                                    ? 'active' : ''
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                <ChevronRight size={16} className="chevron" />
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Admin Main Area */}
                <main className="admin-main">
                    <Routes>
                        <Route index element={<AdminStats />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="courses" element={<AdminAdminCourses />} />
                        <Route path="payments" element={<AdminPayments />} />
                    </Routes>
                </main>
            </div>

            <style jsx>{`
                .admin-grid {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 40px;
                }
                .admin-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 20px;
                    font-weight: 800;
                    margin-bottom: 40px;
                    padding-left: 12px;
                }
                .admin-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .admin-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border-radius: var(--radius);
                    color: var(--text-secondary);
                    font-weight: 500;
                    transition: var(--transition);
                }
                .admin-nav-item:hover {
                    background-color: var(--bg-secondary);
                    color: var(--primary);
                }
                .admin-nav-item.active {
                    background-color: var(--primary);
                    color: white;
                }
                .admin-nav-item .chevron {
                    margin-left: auto;
                    opacity: 0.5;
                }
                .admin-nav-item.active .chevron {
                    opacity: 1;
                }
                .admin-content {
                    min-height: 500px;
                    padding: 40px;
                }
                @media (max-width: 992px) {
                    .admin-grid {
                        grid-template-columns: 1fr;
                    }
                    .admin-sidebar {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

// Fix the typo in the Route
const AdminAdminCourses = AdminCourses;

export default AdminDashboard;
