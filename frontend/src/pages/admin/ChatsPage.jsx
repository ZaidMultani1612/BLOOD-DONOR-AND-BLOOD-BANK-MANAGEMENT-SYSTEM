import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Building2, Hospital, User, Clock } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ChatsPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize socket
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('receive_message', (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chats/conversations');
      if (res.data.success) {
        setConversations(res.data.conversations);
        if (res.data.conversations.length > 0 && !activePartner) {
          selectPartner(res.data.conversations[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching conversations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const selectPartner = async (conv) => {
    setActivePartner(conv);
    try {
      const res = await api.get(`/chats/${conv.partnerId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
      // Join socket room
      const convId = [user.id, conv.partnerId].sort().join('_');
      socketRef.current?.emit('join_conversation', convId);
    } catch (err) {
      console.error('Error loading messages', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activePartner) return;

    const messageText = inputMessage.trim();
    setInputMessage('');

    try {
      const res = await api.post('/chats/send', {
        recipientId: activePartner.partnerId,
        message: messageText,
      });

      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        // Also emit over socket
        const convId = [user.id, activePartner.partnerId].sort().join('_');
        socketRef.current?.emit('send_message', {
          conversationId: convId,
          sender: user.id,
          senderName: user.name,
          senderRole: user.role,
          recipient: activePartner.partnerId,
          recipientName: activePartner.name,
          recipientRole: activePartner.role,
          message: messageText,
        });
      }
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Hospital & Blood Bank Secure Messaging</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time coordination channel for critical stock requests and transfer schedules
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[540px] overflow-hidden">
        {/* Left: Conversation List */}
        <div className="md:col-span-4 border-r border-slate-100 flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-700" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Channels</h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((conv) => (
              <button
                key={conv.partnerId}
                onClick={() => selectPartner(conv)}
                className={`w-full p-3.5 text-left flex items-start gap-3 transition ${
                  activePartner?.partnerId === conv.partnerId
                    ? 'bg-teal-50/80 border-r-2 border-teal-700'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
                  {conv.role === 'hospital' ? (
                    <Hospital className="w-4 h-4 text-rose-600" />
                  ) : (
                    <Building2 className="w-4 h-4 text-teal-700" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-800 truncate">{conv.name}</p>
                    <span className="text-[10px] text-slate-400 capitalize">{conv.role}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{conv.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Message Window */}
        <div className="md:col-span-8 flex flex-col justify-between">
          {activePartner ? (
            <>
              {/* Active Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{activePartner.name}</h4>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Online & Verified</span>
                  </span>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-slate-50/40">
                {messages.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-12">
                    No message history. Send a query below to start communicating.
                  </p>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.sender === user?.id || m.sender?._id === user?.id;
                    return (
                      <div
                        key={idx}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-3.5 rounded-2xl text-xs ${
                            isMe
                              ? 'bg-[#115E59] text-white rounded-br-xs shadow-xs'
                              : 'bg-white text-slate-800 rounded-bl-xs border border-slate-100 shadow-xs'
                          }`}
                        >
                          <p className="text-[10px] opacity-75 font-semibold mb-0.5">
                            {m.senderName || (isMe ? 'You' : activePartner.name)}
                          </p>
                          <p className="leading-relaxed">{m.message}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>
                            {new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-2 bg-white">
                <input
                  type="text"
                  placeholder={`Message ${activePartner.name}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#115E59] hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select a conversation channel to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;
