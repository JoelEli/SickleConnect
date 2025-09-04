import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSickleConnectWebSocket, useWebSocketMessageHandler } from '@/shared/hooks/useWebSocket';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { WEBSOCKET_EVENTS } from '@/lib/constants';

interface Chat {
  id: string;
  otherUser: {
    id: string;
    fullName: string;
    role: string;
    genotype?: string;
  };
  lastMessage?: {
    content: string;
    timestamp: string;
    senderName: string;
  };
  unreadCount: number;
  updatedAt: string;
}

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    id: string;
    fullName: string;
    role: string;
    genotype?: string;
  };
  isOwn: boolean;
}

interface User {
  id: string;
  fullName: string;
  role: string;
  genotype?: string;
  isOnline: boolean;
}

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize WebSocket connection
  const { isConnected } = useSickleConnectWebSocket(user?._id);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chats and online users
  useEffect(() => {
    const loadData = async () => {
      try {
        const [chatsData, usersData] = await Promise.all([
          apiClient.chat.getChats(),
          apiClient.chat.getOnlineUsers()
        ]);
        setChats(chatsData);
        setOnlineUsers(usersData);
      } catch (error) {
        console.error('Failed to load chat data:', error);
        toast({
          title: "Error",
          description: "Failed to load chat data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, toast]);

  // Handle WebSocket messages
  const handleWebSocketMessage = (message: any) => {
    switch (message.type) {
      case WEBSOCKET_EVENTS.NEW_MESSAGE:
        const { chatId, message: newMsg } = message.data;
        
        // Update messages if this is the current chat
        if (selectedChat && selectedChat.id === chatId) {
          setMessages(prev => [...prev, newMsg]);
        }
        
        // Update chats list
        setChats(prev => prev.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              lastMessage: {
                content: newMsg.content,
                timestamp: newMsg.timestamp,
                senderName: newMsg.sender.fullName
              },
              unreadCount: newMsg.isOwn ? 0 : chat.unreadCount + 1,
              updatedAt: newMsg.timestamp
            };
          }
          return chat;
        }));

        // Show notification for new messages from others
        if (!newMsg.isOwn) {
          toast({
            title: `New message from ${newMsg.sender.fullName}`,
            description: newMsg.content,
          });
        }
        break;
    }
  };

  useWebSocketMessageHandler(handleWebSocketMessage);

  // Start a new chat
  const startNewChat = async (userId: string) => {
    try {
      const chatData = await apiClient.chat.getChat(userId);
      const newChat: Chat = {
        id: chatData.chatId,
        otherUser: chatData.otherUser,
        lastMessage: undefined,
        unreadCount: 0,
        updatedAt: new Date().toISOString()
      };
      
      setSelectedChat(newChat);
      setMessages(chatData.messages);
      
      // Add to chats list if not already there
      setChats(prev => {
        const exists = prev.some(chat => chat.id === newChat.id);
        if (!exists) {
          return [newChat, ...prev];
        }
        return prev;
      });
    } catch (error) {
      console.error('Failed to start chat:', error);
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive",
      });
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || isSending) return;

    setIsSending(true);
    try {
      const message = await apiClient.chat.sendMessage(selectedChat.id, newMessage.trim());
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Select a chat
  const selectChat = async (chat: Chat) => {
    setSelectedChat(chat);
    try {
      const chatData = await apiClient.chat.getChat(chat.otherUser.id);
      setMessages(chatData.messages);
      
      // Mark messages as read
      await apiClient.chat.markAsRead(chat.id);
      
      // Update unread count
      setChats(prev => prev.map(c => 
        c.id === chat.id ? { ...c, unreadCount: 0 } : c
      ));
    } catch (error) {
      console.error('Failed to load chat messages:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Community Chat</h1>
            <p className="text-muted-foreground">
              Connect and chat with other members of the SickleConnect community
            </p>
            {!isConnected && (
              <Badge variant="outline" className="mt-2">
                <Clock className="h-3 w-3 mr-1" />
                Connecting to chat...
              </Badge>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
            {/* Chat List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {chats.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No conversations yet. Start chatting with community members!
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {chats.map((chat) => (
                        <div
                          key={chat.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                            selectedChat?.id === chat.id ? 'bg-muted' : ''
                          }`}
                          onClick={() => selectChat(chat)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {chat.otherUser.fullName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium truncate">
                                  {chat.otherUser.fullName}
                                </p>
                                {chat.unreadCount > 0 && (
                                  <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                                    {chat.unreadCount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {chat.lastMessage?.content || 'No messages yet'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {chat.lastMessage ? formatDistanceToNow(new Date(chat.lastMessage.timestamp), { addSuffix: true }) : ''}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="lg:col-span-2">
              {selectedChat ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {selectedChat.otherUser.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {selectedChat.otherUser.fullName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground capitalize">
                          {selectedChat.otherUser.role}
                          {selectedChat.otherUser.genotype && ` • ${selectedChat.otherUser.genotype}`}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 flex flex-col h-[500px]">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.isOwn
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              }`}>
                                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          disabled={isSending}
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || isSending}
                          size="sm"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-[500px]">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the list to start chatting
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Online Users */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {onlineUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col items-center p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => startNewChat(user.id)}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {user.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    <p className="text-sm font-medium mt-2 text-center truncate w-full">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
