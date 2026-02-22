import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { socketService } from '@/lib/socket';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectSocket: (token: string) => Promise<void>;
  disconnectSocket: () => void;
  setError: (error: string | null) => void;
  setConnecting: (connecting: boolean) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  isConnecting: false,
  error: null,

  connectSocket: async (token: string) => {
    try {
      set({ isConnecting: true, error: null });
      
      const socket = await socketService.connect(token);
      
      socket.on('connect', () => {
        set({ isConnected: true, isConnecting: false });
      });

      socket.on('disconnect', () => {
        set({ isConnected: false });
      });

      socket.on('connect_error', (error) => {
        set({ 
          isConnected: false, 
          isConnecting: false, 
          error: error.message 
        });
      });

      set({ socket, isConnected: true, isConnecting: false });
    } catch (error) {
      set({ 
        isConnecting: false, 
        error: error instanceof Error ? error.message : 'Failed to connect to socket' 
      });
      throw error;
    }
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socketService.disconnect();
      set({ socket: null, isConnected: false, error: null });
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setConnecting: (connecting: boolean) => {
    set({ isConnecting: connecting });
  },
}));
