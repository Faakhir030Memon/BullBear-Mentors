import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

const CertificateTemplate = ({ cert }) => {
    if (!cert) return null;

    return (
        <div className="certificate-wrapper">
            <div className="certificate-container" id={`cert-${cert.certificateId}`}>
                <div className="cert-border-outer">
                    <div className="cert-border-inner">
                        {/* Watermark/Background decoration */}
                        <div className="cert-watermark">BBM</div>
                        
                        <div className="cert-header">
                            <Award size={80} className="cert-gold-icon" />
                            <h1>Certificate of Completion</h1>
                            <p className="cert-sub">This is to certify that</p>
                        </div>

                        <div className="cert-body">
                            <h2 className="recipient-name">{cert.recipientName}</h2>
                            <p className="cert-text">
                                has successfully completed the professional trading course
                            </p>
                            <h3 className="course-name">{cert.courseTitle}</h3>
                            <p className="cert-text">
                                with a grade of <span className="grade-text">{cert.grade}</span>
                            </p>
                        </div>

                        <div className="cert-footer">
                            {/* Manager (Left) */}
                            <div className="footer-item">
                                <div className="signature-container">
                                    <img src="/manager-sig.png" alt="Manager Signature" className="signature-img" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                                <div className="signature-line"></div>
                                <p>Manager</p>
                                <span>BullBear Mentors</span>
                            </div>
                            
                            {/* Center Stamp & Date */}
                            <div className="cert-seal">
                                <ShieldCheck size={50} />
                                <span className="seal-text">BBM VERIFIED</span>
                                <div className="date-badge">
                                    {new Date(cert.completionDate).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Director (Right) */}
                            <div className="footer-item">
                                <div className="signature-container">
                                    <img src="/director-sig.png" alt="Director Signature" className="signature-img" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                                <div className="signature-line"></div>
                                <p>Faakhir Memon</p>
                                <span>Director, BBM</span>
                            </div>
                        </div>

                        <div className="cert-id">
                            Certificate ID: {cert.certificateId}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .certificate-wrapper {
                    padding: 20px;
                    background: #f0f0f0;
                    display: flex;
                    justify-content: center;
                }
                .certificate-container {
                    width: 842px; /* A4 Landscape width in pixels at 72dpi */
                    height: 595px; /* A4 Landscape height */
                    background: white;
                    padding: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    position: relative;
                    overflow: hidden;
                    color: #1a1a1a;
                    font-family: 'Times New Roman', Times, serif;
                }
                .cert-border-outer {
                    border: 10px solid #1a1a1a;
                    height: 100%;
                    padding: 5px;
                }
                .cert-border-inner {
                    border: 2px solid #c9a050;
                    height: 100%;
                    padding: 40px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                }
                .cert-watermark {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 150px;
                    font-weight: 900;
                    opacity: 0.03;
                    z-index: 0;
                    pointer-events: none;
                }
                .cert-header { text-align: center; z-index: 1; }
                .cert-gold-icon { color: #c9a050; margin-bottom: 10px; }
                .cert-header h1 { font-size: 48px; margin: 0; text-transform: uppercase; letter-spacing: 2px; color: #1a1a1a; }
                .cert-sub { font-size: 18px; font-style: italic; margin-top: 10px; }
                
                .cert-body { text-align: center; z-index: 1; }
                .recipient-name { font-size: 42px; color: #c9a050; margin: 20px 0; font-family: 'Brush Script MT', cursive, serif; }
                .cert-text { font-size: 18px; margin: 10px 0; }
                .course-name { font-size: 28px; font-weight: 700; margin: 10px 0; border-bottom: 2px solid #eee; display: inline-block; padding: 0 20px; }
                .grade-text { font-weight: 700; color: #1a1a1a; }

                .cert-footer { width: 100%; display: flex; justify-content: space-between; align-items: flex-end; z-index: 1; padding: 0 40px; margin-top: 40px; }
                .footer-item { text-align: center; width: 200px; }
                
                .signature-container { position: relative; height: 80px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: -10px; z-index: 2; }
                .signature-img { max-height: 100px; max-width: 160px; object-fit: contain; filter: grayscale(100%) contrast(200%) brightness(0.4) saturate(0); mix-blend-mode: multiply; }
                .signature-line { border-bottom: 2px solid #1a1a1a; margin-bottom: 10px; width: 100%; }
                
                .footer-item p { margin: 0; font-weight: 700; font-size: 16px; }
                .footer-item span { font-size: 12px; color: #666; }
                
                .cert-seal { color: #c9a050; display: flex; flex-direction: column; align-items: center; gap: 5px; opacity: 0.9; margin: 0 20px; }
                .seal-text { font-size: 12px; font-weight: 800; letter-spacing: 2px; border: 2px solid #c9a050; padding: 2px 8px; border-radius: 4px; margin-top: 5px; }
                
                .date-badge { margin-top: 10px; font-size: 14px; font-weight: 700; color: #1a1a1a; }
                
                .cert-id { position: absolute; bottom: 10px; right: 10px; font-size: 10px; font-family: monospace; opacity: 0.5; }

                @media print {
                    .certificate-wrapper { background: white; padding: 0; }
                    .certificate-container { box-shadow: none; border: none; }
                }
            `}</style>
        </div>
    );
};

export default CertificateTemplate;
