import React, { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const { data } = await axios.post('/api/auth/forgotpassword', { email });
            setMessage('A reset link has been sent to your email address.');
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page container">
            <div className="auth-card card shadow-lg fade-in">
                <div className="auth-header">
                    <h2>Forgot Password?</h2>
                    <p>Enter your email and we'll send you a link to reset your password.</p>
                </div>

                {message ? (
                    <div className="success-view text-center py-4">
                        <CheckCircle size={64} className="text-success mb-3" />
                        <h3>Email Sent!</h3>
                        <p>{message}</p>
                        <Link to="/login" className="btn btn-primary mt-4">Back to Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="alert alert-danger mb-4">
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group mb-4">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-with-icon">
                                <Mail size={20} />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? <Loader className="animate-spin" size={20} /> : 'Send Reset Link'}
                        </button>

                        <div className="auth-footer mt-4 text-center">
                            <Link to="/login" className="back-link">
                                <ArrowLeft size={16} /> Back to Login
                            </Link>
                        </div>
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
                .input-with-icon input { width: 100%; padding: 12px 12px 12px 45px; border: 1.5px solid #e2e8f0; border-radius: 12px; font-size: 15px; transition: all 0.2s; }
                .input-with-icon input:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1); }
                
                .btn-block { width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; font-weight: 700; padding: 14px; }
                .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--text-secondary); text-decoration: none; font-weight: 600; font-size: 14px; transition: color 0.2s; }
                .back-link:hover { color: var(--primary); }
                
                .alert { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 10px; font-size: 14px; }
                .alert-danger { background: #fff1f0; border: 1px solid #ffa39e; color: #cf1322; }
            `}</style>
        </div>
    );
};

export default ForgotPasswordPage;
