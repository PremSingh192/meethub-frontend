'use client';

import { useEffect, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { useSocketStore } from '@/store/socketStore';
import { useAuthStore } from '@/store/authStore';

export const useSocket = () => {
  const { socket, isConnected, isConnecting, error, connectSocket, disconnectSocket } = useSocketStore();
  const { token, isAuthenticated } = useAuthStore();

  // Auto-connect when authenticated
  useEffect(() => {
    if (isAuthenticated && token && !socket && !isConnecting) {
      connectSocket(token);
    }

    // Auto-disconnect when not authenticated
    if (!isAuthenticated && socket) {
      disconnectSocket();
    }
  }, [isAuthenticated, token, socket, isConnecting, connectSocket, disconnectSocket]);

  // Wrapper for socket.emit with error handling
  const emit = useCallback((event: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', event);
    }
  }, [socket, isConnected]);

  // Wrapper for socket.on with cleanup
  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
      
      // Return cleanup function
      return () => {
        socket.off(event, callback);
      };
    }
    return () => {};
  }, [socket]);

  return {
    socket,
    isConnected,
    isConnecting,
    error,
    emit,
    on,
    connectSocket,
    disconnectSocket,
  };
};
