import React, { useState, useEffect, useRef } from "react";
import { Smile, Paperclip, Send, FileText, Music, Reply, Trash2, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import { messagesAPI, connectionsAPI } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import defaultAvatar from "../assets/profile.jpeg";

const Messages = () => {
  const [connections, setConnections] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); // { messageId, x, y }

  // Get current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.id) {
      setCurrentUserId(user.id);
    }
  }, []);

  // Load connections on mount
  useEffect(() => {
    loadConnections();
  }, []);

  // Handle user selection from URL or location state
  useEffect(() => {
    if (location.state?.userId) {
      // Coming from connections page with specific user
      const userId = location.state.userId;
      const userName = location.state.userName;
      const userAvatar = location.state.userAvatar;
      const userRole = location.state.userRole;

      // Set selected user immediately
      setSelectedUser({
        connection_user_id: userId,
        other_user_id: userId,
        other_user_name: userName,
        other_user_avatar: userAvatar,
        other_user_role: userRole,
        unread_count: 0
      });

      // Save to sessionStorage for persistence
      sessionStorage.setItem('selectedMessageUser', JSON.stringify({
        connection_user_id: userId,
        other_user_id: userId,
        other_user_name: userName,
        other_user_avatar: userAvatar,
        other_user_role: userRole,
      }));
    } else {
      // Check sessionStorage for previously selected user
      const savedUser = sessionStorage.getItem('selectedMessageUser');
      if (savedUser) {
        setSelectedUser(JSON.parse(savedUser));
      }
    }
  }, [location, navigate]);

  // Close context menu when clicking anywhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Load messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.other_user_id || selectedUser.connection_user_id);
    }
  }, [selectedUser]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConnections = async () => {
    try {
      setLoading(true);
      // Load accepted connections
      const response = await connectionsAPI.getAll();

      if (response.connections && response.connections.length > 0) {
        // Transform connections to match the format we need
        const formattedConnections = response.connections.map(conn => {
          console.log('Connection data:', {
            name: conn.mentor_name,
            avatar: conn.mentor_avatar,
            userId: conn.connection_user_id
          });

          // Capitalize role properly
          const role = conn.mentor_role ?
            conn.mentor_role.charAt(0).toUpperCase() + conn.mentor_role.slice(1) :
            'User';

          return {
            connection_id: conn.connection_id,
            connection_user_id: conn.connection_user_id,
            other_user_id: conn.connection_user_id,
            other_user_name: conn.mentor_name,
            other_user_avatar: conn.mentor_avatar || defaultAvatar,
            other_user_role: role,
            unread_count: 0, // Will be updated when we load conversations
            last_message_preview: null,
            last_message_at: null
          };
        });

        setConnections(formattedConnections);

        // Auto-select first connection ONLY on desktop if no user is selected
        if (!selectedUser && formattedConnections.length > 0 && window.innerWidth >= 768) {
          const firstConnection = formattedConnections[0];
          setSelectedUser(firstConnection);
          sessionStorage.setItem('selectedMessageUser', JSON.stringify(firstConnection));
        }
      }
    } catch (error) {
      console.error('Failed to load connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (receiverId) => {
    try {
      const response = await messagesAPI.getChatHistory(receiverId, { limit: 100, offset: 0 });
      // Reverse to show oldest first
      setMessages((response.messages || []).reverse());

      // Mark unread messages as read
      const unreadMessages = response.messages
        ?.filter(msg => !msg.is_read && msg.sender_id !== currentUserId)
        .map(msg => msg.message_id);

      if (unreadMessages && unreadMessages.length > 0) {
        await messagesAPI.markAsRead(receiverId, unreadMessages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      // If conversation doesn't exist yet, just show empty messages
      setMessages([]);
    }
  };

  const handleUserSelect = (connection) => {
    setSelectedUser(connection);
    sessionStorage.setItem('selectedMessageUser', JSON.stringify(connection));
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedUser || sending) return;

    try {
      setSending(true);
      const receiverId = selectedUser.other_user_id || selectedUser.connection_user_id;
      const response = await messagesAPI.sendTextMessage(receiverId, input.trim());

      // Add message to local state
      setMessages([...messages, response.message]);
      setInput("");

      // Update connection preview
      loadConnections();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert(error.response?.data?.message || 'Failed to send message. Make sure you are connected with this user.');
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !selectedUser || sending) return;

    try {
      setSending(true);
      const receiverId = selectedUser.other_user_id || selectedUser.connection_user_id;
      const response = await messagesAPI.sendFileMessage(receiverId, file);

      // Add message to local state
      setMessages([...messages, response.message]);

      // Update connection preview
      loadConnections();
    } catch (error) {
      console.error('Failed to send file:', error);
      alert(error.response?.data?.message || 'Failed to send file.');
    } finally {
      setSending(false);
      event.target.value = ''; // Reset file input
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const now = new Date();
    const istToday = now.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const messageDate = date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    const timeString = date.toLocaleTimeString("en-IN", options);

    if (messageDate === istToday) {
      return timeString;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const istYesterday = yesterday.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    if (messageDate === istYesterday) {
      return `Yesterday ${timeString}`;
    }

    return `${messageDate} ${timeString}`;
  };



  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Navbar />
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5B239]"></div>
          <p className="text-gray-400 font-medium">Loading connections...</p>
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-[#0a0a0a] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <span className="text-5xl mb-4 block">💬</span>
            <h2 className="text-2xl font-bold mb-3">No Connections Yet</h2>
            <p className="text-gray-500 text-sm">Connect with alumni or students to start messaging!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 px-4 pb-4 md:px-8 md:pb-8 flex flex-col">
      <Navbar />
      <div className="max-w-7xl mx-auto w-full h-[85vh] bg-[#0a0a0a] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl flex relative animate-fade-in ring-1 ring-white/5">

        {/* Sidebar */}
        <div className={`w-full md:w-[350px] bg-[#111] border-r border-gray-800 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-800 bg-[#111]/95 backdrop-blur sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 bg-gradient-to-b from-[#C5B239] to-purple-500 rounded-full"></div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Messages</h2>
                <p className="text-gray-500 text-xs mt-0.5 font-medium">{connections.length} Connections</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {connections.map((conn, idx) => (
              <div
                key={conn.connection_id}
                onClick={() => handleUserSelect(conn)}
                style={{ animationDelay: `${idx * 0.05}s` }}
                className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-300 group animate-slide-up opacity-0 ${selectedUser?.connection_user_id === conn.connection_user_id
                  ? "bg-gray-800/90 border border-gray-700 shadow-md translate-x-1"
                  : "hover:bg-gray-900 border border-transparent hover:translate-x-1"
                  }`}
              >
                <div className="relative">
                  <img
                    src={conn.other_user_avatar}
                    alt={conn.other_user_name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-800 group-hover:ring-[#C5B239]/40 transition-all shadow-sm"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                  {conn.unread_count > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C5B239] text-black text-xs font-bold rounded-full flex items-center justify-center border-2 border-black shadow-sm transform scale-100 animate-pulse">
                      {conn.unread_count}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-semibold truncate text-[15px] transition-colors ${selectedUser?.connection_user_id === conn.connection_user_id ? 'text-[#C5B239]' : 'text-gray-200 group-hover:text-white'}`}>
                      {conn.other_user_name}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {conn.last_message_at ? formatTimestamp(conn.last_message_at).split(' ')[0] : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate group-hover:text-gray-400 transition-colors font-medium">
                    {conn.last_message_preview || 'Start a conversation'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className={`flex-1 flex flex-col bg-[#0f0f0f] relative ${selectedUser ? 'flex w-full' : 'hidden md:flex'}`}>
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: `radial-gradient(circle at 2px 2px, gray 1px, transparent 0)`, backgroundSize: '24px 24px' }}>
          </div>

          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="h-20 px-6 flex items-center border-b border-gray-800 bg-[#141414]/80 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="md:hidden mr-4 p-2 -ml-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-all active:scale-95"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="relative group cursor-pointer">
                  <img
                    src={selectedUser.other_user_avatar}
                    alt={selectedUser.other_user_name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-700 group-hover:ring-[#C5B239]/50 transition-all shadow-md"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#141414] rounded-full shadow-sm"></div>
                </div>

                <div className="ml-4 cursor-pointer">
                  <h3 className="font-bold text-gray-100 text-lg leading-tight group-hover:text-[#C5B239] transition-colors">{selectedUser.other_user_name}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#C5B239] font-bold tracking-wide uppercase">{selectedUser.other_user_role || 'User'}</p>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <p className="text-xs text-green-500 font-medium tracking-wide">Online</p>
                  </div>
                </div>

                <div className="ml-auto flex gap-3 text-gray-400">
                  {/* Actions could go here */}
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-transparent relative z-10">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/5">
                      <Send className="w-10 h-10 text-gray-500 ml-1 opacity-80" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No messages yet</h3>
                    <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                      Say hello to <span className="text-[#C5B239] font-semibold">{selectedUser.other_user_name}</span> and start connecting!
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => {
                      const isMe = msg.sender_id === currentUserId;
                      // const isLast = idx === messages.length - 1; // Unused
                      return (
                        <div
                          key={msg.message_id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"} group animate-slide-up opacity-0 fill-mode-forwards`}
                          style={{ animationDelay: `${Math.min(idx * 0.05, 0.5)}s` }}
                        >
                          <div className={`flex flex-col max-w-[75%] md:max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                            <div
                              className={`px-5 py-3 rounded-2xl shadow-md text-[15px] leading-relaxed relative border ${isMe
                                ? "bg-gradient-to-br from-[#C5B239] to-[#8a7b20] text-black border-[#C5B239]/20 rounded-tr-sm"
                                : "bg-[#1f1f1f] text-gray-100 border-gray-700/50 rounded-tl-sm hover:bg-[#252525] transition-colors"
                                }`}
                            >
                              {msg.message_type === 'text' && (
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                              )}

                              {msg.message_type === 'file' && msg.attachment && (
                                <div className={`flex items-center gap-3 p-2.5 rounded-xl mt-1 backdrop-blur-sm border transition-all ${isMe ? "bg-black/10 border-black/5 hover:bg-black/20" : "bg-black/20 border-white/5 hover:bg-black/30"}`}>
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${isMe ? "bg-white/30 text-black" : "bg-[#333] text-gray-300"}`}>
                                    <FileText className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate max-w-[140px]">{msg.attachment.original_filename}</p>
                                    <a
                                      href={msg.attachment.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`text-xs underline block truncate ${isMe ? "text-black/70 hover:text-black" : "text-gray-400 hover:text-white"}`}
                                    >
                                      Click to open
                                    </a>
                                  </div>
                                </div>
                              )}

                              <div className={`text-[10px] mt-1.5 font-bold flex items-center justify-end gap-1 ${isMe ? "text-black/50" : "text-gray-500"}`}>
                                {formatTimestamp(msg.created_at)}
                                {isMe && <span className="text-black/60 font-black">✓</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[#141414]/95 backdrop-blur border-t border-gray-800 sticky bottom-0 z-20">
                <div className="relative flex items-end gap-3 max-w-4xl mx-auto">
                  {showEmojiPicker && (
                    <div className="absolute bottom-16 left-0 bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 shadow-2xl z-30 w-80 animate-fade-in ring-1 ring-white/10">
                      <div className="grid grid-cols-8 gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                        {['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸'].map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setInput(input + emoji);
                              setShowEmojiPicker(false);
                            }}
                            className="text-xl hover:bg-gray-700/50 rounded-lg p-1.5 transition-all hover:scale-110 active:scale-95"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-3 text-gray-400 hover:text-[#C5B239] bg-gray-800 hover:bg-gray-700 rounded-xl transition-all shadow-sm ring-1 ring-gray-700 hover:ring-[#C5B239]/50"
                  >
                    <Smile size={22} className="transition-transform active:rotate-12" />
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-400 hover:text-[#C5B239] bg-gray-800 hover:bg-gray-700 rounded-xl transition-all shadow-sm ring-1 ring-gray-700 hover:ring-[#C5B239]/50"
                  >
                    <Paperclip size={22} className="transition-transform active:scale-90" />
                  </button>

                  <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 focus-within:border-[#C5B239]/50 focus-within:ring-1 focus-within:ring-[#C5B239]/20 transition-all shadow-inner">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      placeholder="Type a message..."
                      disabled={sending}
                      className="w-full bg-transparent p-3.5 text-white placeholder-gray-500 outline-none text-[15px]"
                    />
                  </div>

                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className={`p-3 rounded-xl transition-all shadow-lg ${!input.trim() || sending
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed ring-1 ring-gray-700'
                      : 'bg-gradient-to-r from-[#C5B239] to-[#a89628] text-black hover:from-[#d4c048] hover:to-[#C5B239] hover:scale-105 active:scale-95 ring-1 ring-[#C5B239]/50'
                      }`}
                  >
                    <Send size={22} className={input.trim() ? "translate-x-0.5" : ""} />
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 relative z-10">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center mb-6 shadow-2xl ring-1 ring-white/5 animate-pulse">
                  <span className="text-5xl">👋</span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#C5B239] p-2 rounded-full border-4 border-[#0f0f0f]">
                  <Send className="w-5 h-5 text-black" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Welcome back!</h3>
              <div className="h-1 w-16 bg-[#C5B239] rounded-full mb-4 opacity-50"></div>
              <p className="text-gray-400 max-w-md text-lg leading-relaxed">
                Select a conversation from the sidebar to start chatting, or find a new mentor to connect with.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
