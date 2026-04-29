import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user, error, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="login-container fade-in">
            <div className="login-card card">
                <div className="login-header">
                    <div className="logo">
                        <TrendingUp size={32} className="text-success" />
                        <span>BullBear Mentors</span>
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Enter your credentials to access your trading dashboard</p>
                </div>

                {error && (
                    <div className="error-alert">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={20} className="icon" />
                            <input
                                type="email"
                                id="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <Lock size={20} className="icon" />
                            <input
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="forgot-password-link">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Logging in...' : (
                            <>
                                Login <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/register" className="text-success">Sign up for free</Link></p>
                </div>
            </div>

            <style>{`
                .login-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: var(--bg-secondary);
                    padding: 20px;
                }
                .login-card {
                    width: 100%;
                    max-width: 450px;
                    padding: 40px;
                }
                .login-header {
                    text-align: center;
                    margin-bottom: 32px;
                }
                .logo {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    font-size: 24px;
                    font-weight: 800;
                    margin-bottom: 24px;
                }
                .login-header h1 {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                .login-header p {
                    color: var(--text-secondary);
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-group label {
                    display: block;
                    font-weight: 500;
                    margin-bottom: 8px;
                    font-size: 14px;
                }
                .input-with-icon {
                    position: relative;
                }
                .input-with-icon .icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #999;
                }
                .input-with-icon input {
                    width: 100%;
                    padding: 12px 12px 12px 44px;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius);
                    font-size: 16px;
                    transition: var(--transition);
                }
                .input-with-icon input:focus {
                    border-color: var(--primary);
                    outline: none;
                    box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
                }
                .btn-block {
                    width: 100%;
                    margin-top: 10px;
                }
                .error-alert {
                    background-color: #fff1f0;
                    border: 1px solid #ffa39e;
                    color: var(--danger);
                    padding: 12px;
                    border-radius: var(--radius);
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                }
                .login-footer {
                    margin-top: 32px;
                    text-align: center;
                    font-size: 14px;
                }
                .login-footer a {
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
