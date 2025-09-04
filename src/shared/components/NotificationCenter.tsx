import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, MessageSquare, Heart, User } from 'lucide-react';
import { useSickleConnectWebSocket, useWebSocketMessageHandler } from '@/shared/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';
import { WEBSOCKET_EVENTS } from '@/lib/constants';

interface Notification {
  id: string;
  type: 'new_post' | 'post_liked' | 'new_comment' | 'user_online';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { isConnected } = useSickleConnectWebSocket(user?._id);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleWebSocketMessage = useCallback((message: any) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type: message.type,
      title: '',
      message: '',
      timestamp: new Date(),
      read: false,
    };

    switch (message.type) {
      case WEBSOCKET_EVENTS.NEW_POST:
        newNotification.title = 'New Post';
        newNotification.message = `${message.data.authorName} shared a new post`;
        break;
      case WEBSOCKET_EVENTS.POST_LIKED:
        newNotification.title = 'Post Liked';
        newNotification.message = `${message.data.userName} liked your post`;
        break;
      case WEBSOCKET_EVENTS.NEW_COMMENT:
        newNotification.title = 'New Comment';
        newNotification.message = `${message.data.userName} commented on your post`;
        break;
      case WEBSOCKET_EVENTS.USER_ONLINE:
        newNotification.title = 'User Online';
        newNotification.message = `${message.data.userName} is now online`;
        break;
    }

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10 notifications
  }, []);

  // Register message handler
  useWebSocketMessageHandler(handleWebSocketMessage);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_post':
        return <MessageSquare className="h-4 w-4" />;
      case 'post_liked':
        return <Heart className="h-4 w-4" />;
      case 'new_comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'user_online':
        return <User className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-6 px-2 text-xs"
                >
                  Mark all read
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearNotifications}
                  className="h-6 px-2 text-xs"
                >
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      notification.read
                        ? 'bg-background'
                        : 'bg-primary/5 border-primary/20'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationCenter;
