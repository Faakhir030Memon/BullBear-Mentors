import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Clock, 
    ShieldCheck, 
    PlayCircle, 
    CreditCard, 
    AlertCircle, 
    CheckCircle,
    ChevronRight,
    Loader
} from 'lucide-react';

const CourseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState('oneMonth');
    const [transactionId, setTransactionId] = useState('');
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);

    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        const fetchCourseAndStatus = async () => {
            try {
                const { data } = await axios.get(`/api/courses/${id}`);
                setCourse(data);
                
                if (user) {
                    const purchaseRes = await axios.get('/api/purchase/my', {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    const activePurchase = purchaseRes.data.find(p => p.course._id === id && p.status === 'active');
                    if (activePurchase) {
                        setIsEnrolled(true);
                    }
                }
                
                setLoading(false);
            } catch (err) {
                setError('Failed to load course details');
                setLoading(false);
            }
        };
        fetchCourseAndStatus();
    }, [id, user]);

    const handlePurchase = async (e) => {
        e.preventDefault();
        if (!transactionId) return;

        setPurchaseLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const durationMap = {
                oneMonth: 1,
                sixMonth: 6,
                twelveMonth: 12
            };

            await axios.post('/api/purchase', {
                courseId: course._id,
                transactionId,
                duration: durationMap[selectedDuration],
                amount: course.prices[selectedDuration]
            }, config);

            setPurchaseSuccess(true);
            setPurchaseLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Purchase failed');
            setPurchaseLoading(false);
        }
    };

    if (loading) return <div className="loader-container"><Loader size={48} className="animate-spin text-success" /></div>;
    if (!course) return <div className="container py-5"><h1>Course not found</h1></div>;

    return (
        <div className="course-details container py-5 fade-in">
            <div className="details-grid">
                {/* Main Content */}
                <div className="course-main">
                    <div className="course-header">
                        <h1>{course.title}</h1>
                        <p className="description">{course.description}</p>
                        <div className="course-meta">
                            <div className="meta-item">
                                <Clock size={18} />
                                <span>Premium Course</span>
                            </div>
                            <div className="meta-item">
                                <ShieldCheck size={18} />
                                <span>Certified Course</span>
                            </div>
                        </div>
                    </div>

                    <div className="course-content-list card">
                        <h2>Course Content</h2>
                        {course.content && course.content.length > 0 ? (
                            course.content.map((item, index) => (
                                <div key={index} className="content-item" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '15px', borderBottom: '1px solid #eee'}}>
                                    <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                        <PlayCircle size={20} className="text-secondary" style={{marginRight: '10px'}} />
                                        <strong>{item.title}</strong>
                                        <span className="duration" style={{marginLeft: 'auto', fontSize: '12px', color: '#666'}}>
                                            {isEnrolled ? (item.fileType?.includes('video') ? 'Video' : 'Document') : 'Locked'}
                                        </span>
                                    </div>
                                    <p style={{fontSize: '14px', color: '#666', marginTop: '5px', marginLeft: '30px'}}>{item.description}</p>
                                    
                                    {isEnrolled ? (
                                        <div style={{marginTop: '10px', marginLeft: '30px'}}>
                                            <a href={item.fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                                                View/Download Material
                                            </a>
                                        </div>
                                    ) : (
                                        <div style={{marginTop: '10px', marginLeft: '30px', fontSize: '12px', color: '#faad14'}}>
                                            <Lock size={12} style={{display: 'inline', marginRight: '5px'}} />
                                            Content locked until payment verification.
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="no-content">No materials attached yet.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar - Purchase Card */}
                <aside className="course-sidebar">
                    <div className="purchase-card card">
                        {purchaseSuccess ? (
                            <div className="success-state text-center">
                                <CheckCircle size={64} className="text-success mb-3" />
                                <h3>Payment Submitted!</h3>
                                <p>Your transaction ID has been sent for verification. Our admin will activate your course within 24 hours.</p>
                                <button onClick={() => navigate('/profile')} className="btn btn-primary btn-block mt-4">
                                    Check My Profile
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="pricing-info">
                                    <h3>Enroll Now</h3>
                                    <div className="duration-selector">
                                        <button 
                                            className={selectedDuration === 'oneMonth' ? 'active' : ''} 
                                            onClick={() => setSelectedDuration('oneMonth')}
                                        >
                                            1 Month
                                        </button>
                                        <button 
                                            className={selectedDuration === 'sixMonth' ? 'active' : ''} 
                                            onClick={() => setSelectedDuration('sixMonth')}
                                        >
                                            6 Months
                                        </button>
                                        <button 
                                            className={selectedDuration === 'twelveMonth' ? 'active' : ''} 
                                            onClick={() => setSelectedDuration('twelveMonth')}
                                        >
                                            12 Months
                                        </button>
                                    </div>
                                    <div className="current-price">
                                        {course.prices[selectedDuration].toLocaleString()} PKR
                                        {selectedDuration !== 'oneMonth' && <span className="discount-tag">Special Discount Applied</span>}
                                    </div>
                                </div>

                                <div className="payment-instructions">
                                    <h4>Payment Instructions:</h4>
                                    <p>Please send the amount to the following account:</p>
                                    <div className="account-details">
                                        <p><strong>Bank:</strong> HBL / Easypaisa</p>
                                        <p><strong>Account:</strong> 0300-1234567</p>
                                        <p><strong>Name:</strong> BullBear Mentors</p>
                                    </div>
                                </div>

                                <form onSubmit={handlePurchase} className="purchase-form">
                                    <div className="form-group">
                                        <label htmlFor="transactionId">Transaction ID</label>
                                        <div className="input-with-icon">
                                            <CreditCard size={18} className="icon" />
                                            <input 
                                                type="text" 
                                                id="transactionId" 
                                                placeholder="Enter Transaction ID"
                                                value={transactionId}
                                                onChange={(e) => setTransactionId(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    {error && <div className="error-text"><AlertCircle size={14} /> {error}</div>}
                                    <button type="submit" className="btn btn-success btn-block" disabled={purchaseLoading}>
                                        {purchaseLoading ? 'Processing...' : 'Submit Payment'}
                                    </button>
                                </form>
                                <p className="secure-note">Secure payment verification via Admin</p>
                            </>
                        )}
                    </div>
                </aside>
            </div>

            <style>{`
                .details-grid {
                    display: grid;
                    grid-template-columns: 1fr 400px;
                    gap: 40px;
                }
                .course-header h1 {
                    font-size: 48px;
                    margin-bottom: 24px;
                }
                .description {
                    font-size: 18px;
                    color: var(--text-secondary);
                    margin-bottom: 32px;
                    line-height: 1.6;
                }
                .course-meta {
                    display: flex;
                    gap: 30px;
                    margin-bottom: 48px;
                }
                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 600;
                }
                .course-content-list h2 {
                    margin-bottom: 24px;
                }
                .content-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 16px;
                    border-bottom: 1px solid var(--border-color);
                }
                .content-item .duration {
                    margin-left: auto;
                    font-size: 12px;
                    color: var(--text-secondary);
                }
                .purchase-card {
                    padding: 32px;
                    position: sticky;
                    top: 100px;
                }
                .duration-selector {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 8px;
                    margin: 20px 0;
                }
                .duration-selector button {
                    padding: 10px;
                    border: 1px solid var(--border-color);
                    background: white;
                    border-radius: var(--radius);
                    font-size: 12px;
                    font-weight: 600;
                    transition: var(--transition);
                }
                .duration-selector button.active {
                    background: var(--primary);
                    color: white;
                    border-color: var(--primary);
                }
                .current-price {
                    font-size: 32px;
                    font-weight: 800;
                    margin-bottom: 24px;
                }
                .discount-tag {
                    display: block;
                    font-size: 12px;
                    color: var(--success);
                    margin-top: 4px;
                }
                .payment-instructions {
                    background: var(--bg-secondary);
                    padding: 16px;
                    border-radius: var(--radius);
                    margin-bottom: 24px;
                    font-size: 14px;
                }
                .account-details {
                    margin-top: 10px;
                }
                .purchase-form {
                    margin-top: 24px;
                }
                .secure-note {
                    text-align: center;
                    font-size: 12px;
                    color: var(--text-secondary);
                    margin-top: 16px;
                }
                .error-text {
                    color: var(--danger);
                    font-size: 12px;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                .mb-3 { margin-bottom: 1rem; }
                .mt-4 { margin-top: 1.5rem; }
                @media (max-width: 992px) {
                    .details-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default CourseDetailsPage;
