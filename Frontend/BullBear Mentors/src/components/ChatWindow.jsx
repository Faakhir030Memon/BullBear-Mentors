import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Paperclip, X, File, Download, Loader, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ recipientId, recipientName, onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const fetchMessages = async () => {
        if (!recipientId) return;
        try {
            const { data } = await axios.get(`/api/messages/${recipientId}`, config);
            setMessages(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, [recipientId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const { data } = await axios.post('/api/messages', {
                recipientId,
                text: newMessage
            }, config);
            setMessages([...messages, data]);
            setNewMessage('');
        } catch (err) {
            alert('Failed to send message');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadRes = await axios.post('/api/upload', formData, config);
            
            const messageData = {
                recipientId,
                text: `Sent a file: ${file.name}`,
                fileUrl: uploadRes.data.url,
                fileType: uploadRes.data.type,
                fileName: file.name
            };

            const { data } = await axios.post('/api/messages', messageData, config);
            setMessages([...messages, data]);
            setIsUploading(false);
        } catch (err) {
            alert('File upload failed');
            setIsUploading(false);
        }
    };

    return (
        <div className="chat-window card shadow-lg">
            <div className="chat-header">
                <div className="user-status">
                    <div className="avatar">
                        <User size={18} />
                    </div>
                    <div>
                        <h4>{recipientName || 'Admin'}</h4>
                        <span className="status">Online</span>
                    </div>
                </div>
                <button onClick={onClose} className="close-btn"><X size={20} /></button>
            </div>

            <div className="chat-messages">
                {loading ? (
                    <div className="chat-loader"><Loader className="animate-spin" /></div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg._id} className={`message-bubble ${msg.sender === user._id ? 'sent' : 'received'}`}>
                            {msg.text && <p>{msg.text}</p>}
                            {msg.fileUrl && (
                                <div className="file-attachment">
                                    <File size={20} />
                                    <div className="file-info">
                                        <span>{msg.fileName || 'Attached File'}</span>
                                        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Download size={14} /> Download
                                        </a>
                                    </div>
                                </div>
                            )}
                            <span className="timestamp">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input" onSubmit={handleSendMessage}>
                <div className="input-wrapper">
                    <label className="attachment-btn">
                        <Paperclip size={20} />
                        <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                    </label>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    {isUploading ? (
                        <Loader className="animate-spin text-success" size={20} />
                    ) : (
                        <button type="submit" className="send-btn"><Send size={20} /></button>
                    )}
                </div>
            </form>

            <style>{`
                .chat-window {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 380px;
                    height: 500px;
                    display: flex;
                    flex-direction: column;
                    z-index: 1000;
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    overflow: hidden;
                    background: white;
                }
                .chat-header {
                    padding: 15px 20px;
                    background: var(--primary);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .user-status { display: flex; align-items: center; gap: 12px; }
                .avatar { width: 35px; height: 35px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .chat-header h4 { margin: 0; font-size: 16px; }
                .status { font-size: 11px; opacity: 0.8; display: flex; align-items: center; gap: 4px; }
                .status::before { content: ''; width: 6px; height: 6px; background: #4caf50; border-radius: 50%; }
                .close-btn { background: none; border: none; color: white; cursor: pointer; padding: 5px; }
                
                .chat-messages {
                    flex-grow: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: #f8f9fa;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .message-bubble {
                    max-width: 80%;
                    padding: 10px 14px;
                    border-radius: 12px;
                    font-size: 14px;
                    position: relative;
                }
                .message-bubble.sent {
                    align-self: flex-end;
                    background: var(--primary);
                    color: white;
                    border-bottom-right-radius: 2px;
                }
                .message-bubble.received {
                    align-self: flex-start;
                    background: white;
                    color: var(--text-main);
                    border-bottom-left-radius: 2px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                }
                .timestamp { font-size: 10px; opacity: 0.6; display: block; margin-top: 4px; text-align: right; }
                
                .file-attachment {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(0,0,0,0.05);
                    padding: 8px;
                    border-radius: 8px;
                    margin-bottom: 5px;
                }
                .file-info { display: flex; flex-direction: column; gap: 4px; }
                .file-info span { font-size: 12px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
                .file-info a { font-size: 11px; display: flex; align-items: center; gap: 3px; color: inherit; font-weight: bold; }
                
                .chat-input { padding: 15px; background: white; border-top: 1px solid var(--border-color); }
                .input-wrapper { display: flex; align-items: center; gap: 10px; background: #f0f2f5; padding: 5px 15px; border-radius: 25px; }
                .chat-input input { flex-grow: 1; border: none; background: none; padding: 8px 0; font-size: 14px; outline: none; }
                .attachment-btn { cursor: pointer; color: #65676b; display: flex; align-items: center; transition: color 0.2s; }
                .attachment-btn:hover { color: var(--primary); }
                .send-btn { background: none; border: none; color: var(--primary); cursor: pointer; display: flex; align-items: center; }
                
                .chat-loader { display: flex; justify-content: center; align-items: center; height: 100%; }
                
                @media (max-width: 480px) {
                    .chat-window { width: calc(100% - 40px); height: calc(100% - 40px); bottom: 20px; right: 20px; }
                }
            `}</style>
        </div>
    );
};

export default ChatWindow;
