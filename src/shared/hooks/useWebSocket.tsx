import { useEffect, useRef, useState, useCallback } from 'react';
import { WEBSOCKET_EVENTS } from '@/lib/constants';

interface WebSocketMessage {
  type: string;
  data: any;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const connect = useCallback(() => {
    if (isConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    isConnectingRef.current = true;
    
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        isConnectingRef.current = false;
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          onMessage?.(message);
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        isConnectingRef.current = false;
        onClose?.();
        
        // Only attempt to reconnect if we haven't exceeded max attempts
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (event) => {
        setError('WebSocket connection error');
        isConnectingRef.current = false;
        onError?.(event);
      };
    } catch (err) {
      setError('Failed to create WebSocket connection');
      isConnectingRef.current = false;
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    isConnectingRef.current = false;
    reconnectAttemptsRef.current = 0;
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    sendMessage,
    connect,
    disconnect,
  };
}

// Global WebSocket instance to prevent multiple connections
let globalWebSocket: WebSocket | null = null;
let globalWebSocketUrl: string | null = null;
const globalMessageHandlers = new Set<(message: WebSocketMessage) => void>();

// Specific hook for SickleConnect WebSocket events
export function useSickleConnectWebSocket(userId?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const wsUrl = `ws://localhost:5000/ws${userId ? `?userId=${userId}` : ''}`;

  const handleMessage = useCallback((message: WebSocketMessage) => {
    // This will be called for all registered handlers
    switch (message.type) {
      case WEBSOCKET_EVENTS.NEW_POST:
        // Handle new post
        break;
      case WEBSOCKET_EVENTS.POST_LIKED:
        // Handle post liked
        break;
      case WEBSOCKET_EVENTS.NEW_COMMENT:
        // Handle new comment
        break;
      case WEBSOCKET_EVENTS.USER_ONLINE:
        // Handle user online
        break;
      case WEBSOCKET_EVENTS.USER_OFFLINE:
        // Handle user offline
        break;
      default:
        console.log('Unknown WebSocket message:', message);
    }
  }, []);

  useEffect(() => {
    // If we already have a WebSocket connection to the same URL, use it
    if (globalWebSocket && globalWebSocketUrl === wsUrl) {
      setIsConnected(globalWebSocket.readyState === WebSocket.OPEN);
      globalMessageHandlers.add(handleMessage);
      
      return () => {
        globalMessageHandlers.delete(handleMessage);
      };
    }

    // Close existing connection if URL changed
    if (globalWebSocket) {
      globalWebSocket.close();
      globalWebSocket = null;
      globalWebSocketUrl = null;
    }

    // Create new connection
    try {
      globalWebSocket = new WebSocket(wsUrl);
      globalWebSocketUrl = wsUrl;

      globalWebSocket.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected:', wsUrl);
      };

      globalWebSocket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          // Notify all handlers
          globalMessageHandlers.forEach(handler => handler(message));
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      globalWebSocket.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected:', wsUrl);
        globalWebSocket = null;
        globalWebSocketUrl = null;
      };

      globalWebSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      globalMessageHandlers.add(handleMessage);

      return () => {
        globalMessageHandlers.delete(handleMessage);
        // Only close if no other handlers are using this connection
        if (globalMessageHandlers.size === 0 && globalWebSocket) {
          globalWebSocket.close();
          globalWebSocket = null;
          globalWebSocketUrl = null;
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setIsConnected(false);
    }
  }, [wsUrl, handleMessage]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (globalWebSocket && globalWebSocket.readyState === WebSocket.OPEN) {
      globalWebSocket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const sendPostUpdate = useCallback((postId: string, type: string, data: any) => {
    sendMessage({
      type: 'post_update',
      data: { postId, updateType: type, ...data },
    });
  }, [sendMessage]);

  const sendUserStatus = useCallback((status: 'online' | 'offline') => {
    sendMessage({
      type: 'user_status',
      data: { status },
    });
  }, [sendMessage]);

  return {
    isConnected,
    sendMessage,
    sendPostUpdate,
    sendUserStatus,
  };
}

// Hook to register message handlers
export function useWebSocketMessageHandler(handler: (message: WebSocketMessage) => void) {
  useEffect(() => {
    globalMessageHandlers.add(handler);
    
    return () => {
      globalMessageHandlers.delete(handler);
    };
  }, [handler]);
}
