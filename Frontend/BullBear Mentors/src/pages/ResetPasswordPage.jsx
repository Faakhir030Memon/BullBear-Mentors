import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        setError('');

        try {
            await axios.put(`/api/auth/resetpassword/${token}`, { password });
            setSuccess(true);
            setLoading(false);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired token');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page container">
            <div className="auth-card card shadow-lg fade-in">
                <div className="auth-header">
                    <h2>Reset Password</h2>
                    <p>Enter your new password below to regain access to your account.</p>
                </div>

                {success ? (
                    <div className="success-view text-center py-4">
                        <CheckCircle size={64} className="text-success mb-3" />
                        <h3>Success!</h3>
                        <p>Your password has been reset successfully. Redirecting you to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="alert alert-danger mb-4">
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group mb-3">
                            <label htmlFor="password">New Password</label>
                            <div className="input-with-icon">
                                <Lock size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button" 
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group mb-4">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <div className="input-with-icon">
                                <Lock size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? <Loader className="animate-spin" size={20} /> : 'Update Password'}
                        </button>
                    </form>
                )}
            </div>

            <style>{`
                .auth-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; }
                .auth-card { max-width: 450px; width: 100%; padding: 40px; border-radius: 20px; }
                .auth-header { text-align: center; margin-bottom: 30px; }
                .auth-header h2 { font-size: 28px; font-weight: 800; color: var(--primary); margin-bottom: 10px; }
                .auth-header p { color: var(--text-secondary); font-size: 14px; }
                
                .input-with-icon { position: relative; display: flex; align-items: center; }
                .input-with-icon svg { position: absolute; left: 15px; color: #94a3b8; }
                .input-with-icon input { width: 100%; padding: 12px 45px 12px 45px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; transition: all 0.2s; }
                .input-with-icon input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }
                
                .toggle-password { position: absolute; right: 15px; background: none; border: none; color: #94a3b8; cursor: pointer; display: flex; align-items: center; }
                
                .btn-block { width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; font-weight: 700; padding: 14px; }
                .alert { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 10px; font-size: 14px; }
                .alert-danger { background: #fff1f0; border: 1px solid #ffa39e; color: #cf1322; }
            `}</style>
        </div>
    );
};

export default ResetPasswordPage;
