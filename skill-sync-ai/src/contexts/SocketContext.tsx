/**
 * Socket.IO Context
 * Provides real-time messaging functionality
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { Message, SocketMessage } from '@/types';
import { getAuthToken } from '@/lib/api-client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinSwapRoom: (swapId: number) => void;
  leaveSwapRoom: (swapId: number) => void;
  sendMessage: (swapId: number, content: string) => void;
  sendTyping: (swapId: number, isTyping: boolean) => void;
  onMessage: (callback: (message: Message) => void) => void;
  onTyping: (callback: (data: { swapId: number; userId: number; isTyping: boolean }) => void) => void;
  onNotification: (callback: (notification: any) => void) => void;
  notifications: any[];
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000';

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { isAuthenticated, user } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect if not authenticated
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = getAuthToken();
    if (!token) return;

    // Create socket connection
    const newSocket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 Socket connection error:', error);
      toast.error('Failed to connect to chat server');
    });

    newSocket.on('error', (error: any) => {
      console.error('🔴 Socket error:', error);
      toast.error(error.message || 'Chat error occurred');
    });

    // Global notification listener
    newSocket.on('notification', (data: any) => {
      const newNotification = {
        id: Date.now().toString(),
        type: data.type,
        title: data.title,
        message: data.message,
        timestamp: new Date(data.timestamp),
        read: false,
        actionUrl: data.type === 'message' ? `/messages?swapId=${data.data.swapId}` : '/swaps',
        data: data.data,
      };

      setNotifications(prev => [newNotification, ...prev]);

      // Show toast notification
      toast.info(data.title, {
        description: data.message,
      });
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  /**
   * Join a swap room
   */
  const joinSwapRoom = useCallback(
    (swapId: number) => {
      if (!socket || !isConnected) {
        console.warn('Cannot join room: socket not connected');
        return;
      }

      socket.emit('join', { swapId }, (response: any) => {
        if (response?.error) {
          console.error('Failed to join room:', response.error);
          toast.error('Failed to join chat');
        } else {
          console.log(`✅ Joined swap room: ${swapId}`);
        }
      });
    },
    [socket, isConnected]
  );

  /**
   * Leave a swap room
   */
  const leaveSwapRoom = useCallback(
    (swapId: number) => {
      if (!socket || !isConnected) return;

      socket.emit('leave', { swapId });
      console.log(`👋 Left swap room: ${swapId}`);
    },
    [socket, isConnected]
  );

  /**
   * Send a message
   */
  const sendMessage = useCallback(
    (swapId: number, content: string) => {
      if (!socket || !isConnected) {
        toast.error('Not connected to chat server');
        return;
      }

      socket.emit('message', { swapId, content }, (response: any) => {
        if (response?.error) {
          console.error('Failed to send message:', response.error);
          toast.error('Failed to send message');
        }
      });
    },
    [socket, isConnected]
  );

  /**
   * Send typing indicator
   */
  const sendTyping = useCallback(
    (swapId: number, isTyping: boolean) => {
      if (!socket || !isConnected) return;

      socket.emit('typing', { swapId, isTyping });
    },
    [socket, isConnected]
  );

  /**
   * Listen for incoming messages
   */
  const onMessage = useCallback(
    (callback: (message: Message) => void) => {
      if (!socket) return;

      socket.on('message', callback);

      // Return cleanup function
      return () => {
        socket.off('message', callback);
      };
    },
    [socket]
  );

  /**
   * Listen for typing events
   */
  const onTyping = useCallback(
    (callback: (data: { swapId: number; userId: number; isTyping: boolean }) => void) => {
      if (!socket) return;

      socket.on('typing', callback);

      // Return cleanup function
      return () => {
        socket.off('typing', callback);
      };
    },
    [socket]
  );

  /**
   * Listen for notifications
   */
  const onNotification = useCallback(
    (callback: (notification: any) => void) => {
      if (!socket) return;

      socket.on('notification', callback);

      // Return cleanup function
      return () => {
        socket.off('notification', callback);
      };
    },
    [socket]
  );

  /**
   * Mark notification as read
   */
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  /**
   * Delete notification
   */
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  /**
   * Clear all notifications
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value: SocketContextType = {
    socket,
    isConnected,
    joinSwapRoom,
    leaveSwapRoom,
    sendMessage,
    sendTyping,
    onMessage,
    onTyping,
    onNotification,
    notifications,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

/**
 * Custom hook to use socket context
 */
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
