'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';
import { useMeetingStore } from '@/store/meetingStore';
import { meetingAPI } from '@/lib/api';
import { Room, ChatMessage } from '@/types';
import { generateRoomCode } from '@/lib/utils';
import toast from 'react-hot-toast';

export const useMeeting = () => {
  const router = useRouter();
  const { emit, on } = useSocket();
  const { user, isAuthenticated } = useAuth();
  const {
    currentRoom,
    participants,
    chatMessages,
    setCurrentRoom,
    setParticipants,
    addChatMessage,
    clearChatMessages,
    resetMeetingState,
  } = useMeetingStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new meeting room
  const createRoom = async (title: string, password?: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to create a room');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await meetingAPI.createRoom(title, password);
      console.log('Create room response:', response);
      
      // Extract room data from the correct nested structure
      const room = response.data.data;
      console.log('Extracted room data:', room);
      
      if (!room) {
        throw new Error('Invalid response: missing room data');
      }
      
      setCurrentRoom(room);
      toast.success('Meeting created successfully');
      
      return room;
    } catch (error: any) {
      console.error('Create room error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create room';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Join an existing meeting room
  const joinRoom = async (roomCode: string, password?: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to join a room');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get room details
      const roomResponse = await meetingAPI.getRoom(roomCode);
      const room = roomResponse.data;

      // Join the room via API
      await meetingAPI.joinRoom(roomCode, password);

      // Join via socket
      emit('join-room', { room_code: roomCode });

      setCurrentRoom(room);
      toast.success('Joined meeting successfully');

      return room;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to join room';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Leave the current meeting
  const leaveRoom = async () => {
    if (!currentRoom) return;

    setIsLoading(true);

    try {
      // Leave via API
      await meetingAPI.leaveRoom(currentRoom.roomCode);

      // Leave via socket
      emit('leave-room');

      // Reset state
      resetMeetingState();
      
      toast.success('Left meeting');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to leave room');
    } finally {
      setIsLoading(false);
    }
  };

  // Send chat message
  const sendMessage = (message: string) => {
    if (!currentRoom || !user) return;

    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name || user.email,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isEmoji: /^[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]$/u.test(message.trim()),
    };

    emit('chat-message', { message: chatMessage.message });
    addChatMessage(chatMessage);
  };

  // Get user's meeting rooms
  const getUserRooms = async () => {
    if (!isAuthenticated) return [];

    try {
      const response = await meetingAPI.getUserRooms();
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get rooms');
      return [];
    }
  };

  // Get chat history for a room
  const getChatHistory = async (roomId: string, limit = 50) => {
    try {
      const response = await meetingAPI.getChatHistory(roomId, limit);
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to get chat history');
      return [];
    }
  };

  // Setup socket listeners
  useEffect(() => {
    if (!isAuthenticated) return;

    const cleanupUserJoined = on('user-joined', (data) => {
      setParticipants(data.participants);
      toast.success(`${data.user.name || data.user.email} joined the meeting`);
    });

    const cleanupUserLeft = on('user-left', (data) => {
      setParticipants(prev => prev.filter(p => p.user.id !== data.user.id));
      toast.success(`${data.user.name || data.user.email} left the meeting`);
    });

    const cleanupChatMessage = on('chat-message', (data) => {
      addChatMessage(data);
    });

    return () => {
      cleanupUserJoined();
      cleanupUserLeft();
      cleanupChatMessage();
    };
  }, [isAuthenticated, on, setParticipants, addChatMessage]);

  return {
    currentRoom,
    participants,
    chatMessages,
    isLoading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
    getUserRooms,
    getChatHistory,
  };
};
