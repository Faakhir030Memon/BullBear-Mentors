import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, User, Loader, Search } from 'lucide-react';
import ChatWindow from '../components/ChatWindow';

const AdminChat = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const fetchConversations = async () => {
        try {
            const { data } = await axios.get('/api/messages/conversations', config);
            setConversations(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch conversations', err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 5000); // Poll conversations every 5s
        return () => clearInterval(interval);
    }, []);

    const filteredConversations = conversations.filter(conv => 
        (conv.user.firstName + ' ' + conv.user.lastName).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loader-container"><Loader size={48} className="animate-spin text-success" /></div>;

    return (
        <div className="admin-chat container py-4 fade-in">
            <div className="admin-header mb-4">
                <h2>Customer Messages</h2>
                <p>Manage and respond to student inquiries in real-time.</p>
            </div>

            <div className="chat-layout card">
                <div className="conversations-sidebar">
                    <div className="search-box">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="Search students..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="conv-list">
                        {filteredConversations.length > 0 ? (
                            filteredConversations.map((conv) => (
                                <div 
                                    key={conv._id} 
                                    className={`conv-item ${selectedConv?._id === conv._id ? 'active' : ''}`}
                                    onClick={() => setSelectedConv(conv)}
                                >
                                    <div className="avatar">
                                        {conv.user.firstName[0]}{conv.user.lastName?.[0]}
                                    </div>
                                    <div className="conv-info">
                                        <div className="conv-header">
                                            <strong>{conv.user.firstName} {conv.user.lastName}</strong>
                                            <span className="time">{new Date(conv.lastMessage.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="last-msg">
                                            <p>{conv.lastMessage.text || 'Shared a file'}</p>
                                            {conv.unreadCount > 0 && <span className="unread-badge">{conv.unreadCount}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-conv">
                                <MessageSquare size={32} opacity={0.3} />
                                <p>No conversations found</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="chat-area">
                    {selectedConv ? (
                        <div className="active-chat">
                            <div className="chat-meta">
                                <h3>{selectedConv.user.firstName} {selectedConv.user.lastName}</h3>
                                <span>Student</span>
                            </div>
                            {/* We use the same ChatWindow logic but embedded here */}
                            {/* For simplicity, I'll just reuse the component but positioned differently or create an inline version */}
                            <ChatWindow 
                                recipientId={selectedConv._id} 
                                recipientName={selectedConv.user.firstName + ' ' + selectedConv.user.lastName} 
                                onClose={() => setSelectedConv(null)}
                            />
                        </div>
                    ) : (
                        <div className="chat-placeholder">
                            <MessageSquare size={64} className="mb-3" opacity={0.1} />
                            <h3>Select a conversation</h3>
                            <p>Choose a student from the left to start chatting</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .admin-chat { height: calc(100vh - 150px); min-height: 600px; }
                .chat-layout { display: grid; grid-template-columns: 350px 1fr; height: 100%; overflow: hidden; padding: 0 !important; }
                
                .conversations-sidebar { border-right: 1px solid var(--border-color); display: flex; flex-direction: column; background: #fff; }
                .search-box { padding: 20px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 10px; background: #fcfcfc; }
                .search-box input { border: none; background: none; outline: none; font-size: 14px; width: 100%; }
                
                .conv-list { flex-grow: 1; overflow-y: auto; }
                .conv-item { padding: 15px 20px; display: flex; gap: 12px; cursor: pointer; transition: background 0.2s; border-bottom: 1px solid #f5f5f5; }
                .conv-item:hover { background: #f9f9f9; }
                .conv-item.active { background: #f0f7ff; border-right: 3px solid var(--primary); }
                
                .avatar { width: 40px; height: 40px; background: var(--bg-secondary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary); font-size: 14px; }
                .conv-info { flex-grow: 1; min-width: 0; }
                .conv-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
                .conv-header strong { font-size: 14px; }
                .time { font-size: 11px; color: #999; }
                
                .last-msg { display: flex; justify-content: space-between; align-items: center; }
                .last-msg p { font-size: 12px; color: #666; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
                .unread-badge { background: var(--primary); color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px; font-weight: 700; }
                
                .chat-area { background: #fcfcfc; position: relative; }
                .chat-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #999; }
                .active-chat { height: 100%; display: flex; flex-direction: column; }
                .chat-meta { padding: 15px 25px; border-bottom: 1px solid var(--border-color); background: white; }
                .chat-meta h3 { margin: 0; font-size: 16px; }
                .chat-meta span { font-size: 12px; color: #999; }
                
                /* Override ChatWindow styles when in admin view */
                .active-chat .chat-window { position: relative; bottom: 0; right: 0; width: 100%; height: 100%; border: none; border-radius: 0; }
                .active-chat .chat-header { display: none; }
            `}</style>
        </div>
    );
};

export default AdminChat;
