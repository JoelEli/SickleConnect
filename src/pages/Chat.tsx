import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSickleConnectWebSocket, useWebSocketMessageHandler } from '@/shared/hooks/useWebSocket';
import { apiClient } from '@/lib/api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  MessageCircle, Send, Users, Loader2, Search, ArrowLeft,
} from 'lucide-react';
import { formatDistanceToNow, isValid } from 'date-fns';

function safeTimeAgo(timestamp: string | undefined, addSuffix = true): string {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (!isValid(date)) return '';
  try { return formatDistanceToNow(date, { addSuffix }); } catch { return ''; }
}
import { useToast } from '@/hooks/use-toast';
import { WEBSOCKET_EVENTS } from '@/lib/constants';
import DarkNavbar from '@/shared/components/DarkNavbar';
import PageWrapper from '@/shared/components/PageWrapper';

interface ChatType {
  id: string;
  otherUser: { id: string; fullName: string; role: string; genotype?: string };
  lastMessage?: { content: string; timestamp: string; senderName: string };
  unreadCount: number;
  updatedAt: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: { id: string; fullName: string; role: string; genotype?: string };
  isOwn: boolean;
}

interface OnlineUser {
  id: string;
  fullName: string;
  role: string;
  genotype?: string;
  isOnline: boolean;
}

const glass = 'bg-[#161f35]/60 backdrop-blur-xl border border-white/[0.1]';
const glassCard = 'bg-[#2d3449]/40 backdrop-blur-lg border border-white/[0.05] transition-all duration-300 hover:bg-[#cabeff]/10 hover:border-[#cabeff]/30 hover:shadow-[0_0_20px_rgba(124,93,255,0.15)] hover:-translate-y-0.5';

const ChatPage = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [chats, setChats] = useState<ChatType[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isConnected } = useSickleConnectWebSocket(user?._id);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [chatsData, usersData] = await Promise.all([apiClient.chat.getChats(), apiClient.chat.getOnlineUsers()]);
        setChats(chatsData as ChatType[]);
        setOnlineUsers(usersData as OnlineUser[]);
      } catch (err) {
        console.error('Failed to load chat data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) loadData();
  }, [user]);

  const handleWebSocketMessage = (message: any) => {
    if (message.type === WEBSOCKET_EVENTS.NEW_MESSAGE) {
      const { chatId, message: newMsg } = message.data;
      if (selectedChat && selectedChat.id === chatId) setMessages(prev => [...prev, newMsg]);
      setChats(prev => prev.map(chat => chat.id === chatId ? {
        ...chat, lastMessage: { content: newMsg.content, timestamp: newMsg.timestamp, senderName: newMsg.sender.fullName },
        unreadCount: newMsg.isOwn ? 0 : chat.unreadCount + 1, updatedAt: newMsg.timestamp
      } : chat));
      if (!newMsg.isOwn) toast({ title: `New message from ${newMsg.sender.fullName}`, description: newMsg.content });
    }
  };
  useWebSocketMessageHandler(handleWebSocketMessage);

  const startNewChat = async (userId: string) => {
    try {
      const chatData = await apiClient.chat.getChat(userId) as any;
      const newChat: ChatType = { id: chatData.chatId, otherUser: chatData.otherUser, lastMessage: undefined, unreadCount: 0, updatedAt: new Date().toISOString() };
      setSelectedChat(newChat);
      setMessages(chatData.messages);
      setChats(prev => prev.some(c => c.id === newChat.id) ? prev : [newChat, ...prev]);
    } catch { toast({ title: 'Error', description: 'Failed to start chat', variant: 'destructive' }); }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || isSending) return;
    setIsSending(true);
    try {
      const message = await apiClient.chat.sendMessage(selectedChat.id, newMessage.trim()) as Message;
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch { toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' }); }
    finally { setIsSending(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const selectChat = async (chat: ChatType) => {
    setSelectedChat(chat);
    try {
      const chatData = await apiClient.chat.getChat(chat.otherUser.id) as any;
      setMessages(chatData.messages);
      await apiClient.chat.markAsRead(chat.id);
      setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unreadCount: 0 } : c));
    } catch {}
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0b1326]"><Loader2 className="h-8 w-8 animate-spin text-[#cabeff]" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (isLoading) return <div className="min-h-screen bg-[#0b1326]"><DarkNavbar /><div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#cabeff]" /></div></div>;

  const filteredChats = chats.filter(c => c.otherUser.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0b1326] text-[#dbe2fd] flex flex-col">
        <DarkNavbar />

        <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(202,190,255,0.2); border-radius: 10px; }
          @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }
          @keyframes slideInRight { from { opacity: 0; transform: translateX(20px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }
          .msg-in { animation: slideInLeft 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
          .msg-out { animation: slideInRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
        `}</style>

        <main className="flex-1 flex px-4 md:px-10 max-w-[1200px] mx-auto w-full gap-6 pb-6 overflow-hidden">
          {/* Sidebar */}
          <aside className={`hidden lg:flex flex-col w-80 shrink-0 gap-4 pt-6 h-[calc(100vh-64px)]`}>
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Messages</h2>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#938ea1]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#222a3e]/50 border border-white/[0.08] text-white placeholder:text-[#938ea1] focus:outline-none focus:ring-1 focus:ring-[#cabeff] focus:border-[#cabeff] text-sm transition-all"
                placeholder="Search conversations..."
              />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-1">
              {filteredChats.length === 0 ? (
                <div className="text-center py-10 text-white/25 text-sm">No conversations yet</div>
              ) : filteredChats.map(chat => {
                const active = selectedChat?.id === chat.id;
                return (
                  <div
                    key={chat.id}
                    onClick={() => selectChat(chat)}
                    className={`p-4 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                      active
                        ? 'ring-1 ring-[#cabeff]/40 bg-[#cabeff]/5 border border-[#cabeff]/20'
                        : `${glassCard}`
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12 border border-white/10">
                        <AvatarFallback className={`text-sm font-bold text-white ${chat.otherUser.role === 'doctor' ? 'bg-gradient-to-br from-teal-500 to-cyan-600' : 'bg-gradient-to-br from-violet-500 to-purple-600'}`}>
                          {chat.otherUser.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {onlineUsers.find(u => u.id === chat.otherUser.id)?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#0b1326] rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-sm font-semibold text-white truncate">{chat.otherUser.fullName}</span>
                        <span className="text-[10px] text-[#938ea1]">
                          {chat.lastMessage ? safeTimeAgo(chat.lastMessage.timestamp, false) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-[#938ea1] truncate">{chat.lastMessage?.content || 'No messages yet'}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="h-5 min-w-5 rounded-full bg-[#cabeff] text-[#0b1326] flex items-center justify-center text-[10px] font-bold px-1.5">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Chat Area */}
          <section className={`flex-1 flex flex-col h-[calc(100vh-64px)] ${glass} rounded-3xl overflow-hidden mt-6`}>
            {selectedChat ? (
              <>
                {/* Header */}
                <header className="px-6 py-4 flex items-center justify-between border-b border-white/[0.06] bg-[#171f33]/30 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedChat(null)} className="lg:hidden text-white/40 hover:text-white">
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="relative">
                      <Avatar className="h-11 w-11 border-2 border-[#cabeff]/20">
                        <AvatarFallback className={`text-sm font-bold text-white ${selectedChat.otherUser.role === 'doctor' ? 'bg-gradient-to-br from-teal-500 to-cyan-600' : 'bg-gradient-to-br from-violet-500 to-purple-600'}`}>
                          {selectedChat.otherUser.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {onlineUsers.find(u => u.id === selectedChat.otherUser.id)?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0b1326] rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{selectedChat.otherUser.fullName}</h3>
                      <p className="text-xs text-[#cabeff] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cabeff] animate-pulse" />
                        Active Now
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-white/20 px-2">Chat</span>
                  </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 custom-scrollbar">
                  <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full bg-[#171f33] text-[10px] font-bold text-[#938ea1] uppercase tracking-wider">Today</span>
                  </div>

                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isOwn ? 'flex-row-reverse ml-auto' : ''} gap-3 max-w-[85%] md:max-w-[70%] ${msg.isOwn ? 'msg-out' : 'msg-in'}`}>
                      {!msg.isOwn && (
                        <Avatar className="h-8 w-8 border border-white/10 shrink-0 mt-auto">
                          <AvatarFallback className={`text-xs font-bold text-white ${selectedChat.otherUser.role === 'doctor' ? 'bg-gradient-to-br from-teal-500 to-cyan-600' : 'bg-gradient-to-br from-violet-500 to-purple-600'}`}>
                            {msg.sender.fullName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`flex flex-col ${msg.isOwn ? 'items-end' : ''} gap-1`}>
                        <div className={`px-5 py-3 text-sm leading-relaxed ${
                          msg.isOwn
                            ? 'rounded-2xl rounded-br-none bg-[#cabeff] text-[#1c0062] shadow-lg shadow-[#cabeff]/20 font-medium'
                            : 'rounded-2xl rounded-bl-none bg-[#222a3e] text-white/70 border border-white/[0.04]'
                        }`}>
                          {msg.content}
                        </div>
                        <span className={`text-[10px] text-[#938ea1] ${msg.isOwn ? 'mr-1' : 'ml-1'}`}>
                          {safeTimeAgo(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-6 py-4 border-t border-white/[0.06] bg-[#171f33]/30 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      disabled={isSending}
                      className="flex-1 px-5 py-3.5 rounded-2xl bg-[#222a3e]/50 border border-white/[0.08] text-white placeholder:text-[#938ea1] focus:outline-none focus:ring-1 focus:ring-[#cabeff] focus:border-[#cabeff] text-sm transition-all"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className="h-12 w-12 rounded-2xl bg-gradient-to-r from-[#937dff] to-[#00a6e0] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-30 shadow-lg shadow-[#937dff]/20"
                    >
                      {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-white/10 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white/40 mb-1">Select a conversation</h3>
                  <p className="text-sm text-white/20">Choose from the sidebar or start a new chat below</p>
                </div>
              </div>
            )}
          </section>
        </main>

        {/* Online Users */}
        {onlineUsers.length > 0 && (
          <div className="px-4 md:px-10 pb-6 max-w-[1200px] mx-auto w-full">
            <div className={`${glass} rounded-2xl p-5`}>
              <h3 className="text-sm font-semibold text-white/50 mb-4 flex items-center gap-2">
                <Users className="h-4 w-4" /> Community Members
              </h3>
              <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-2">
                {onlineUsers.map(u => (
                  <motion.button
                    key={u.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => startNewChat(u.id)}
                    className="flex flex-col items-center gap-2 min-w-[72px] group"
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12 border border-white/10 group-hover:border-[#cabeff]/30 transition-colors">
                        <AvatarFallback className={`text-sm font-bold text-white ${u.role === 'doctor' ? 'bg-gradient-to-br from-teal-500 to-cyan-600' : 'bg-gradient-to-br from-violet-500 to-purple-600'}`}>
                          {u.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {u.isOnline && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#0b1326] rounded-full" />}
                    </div>
                    <span className="text-[11px] text-white/40 truncate w-full text-center group-hover:text-white/60 transition-colors">{u.fullName.split(' ')[0]}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default ChatPage;
