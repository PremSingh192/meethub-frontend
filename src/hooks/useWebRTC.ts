'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { WebRTCService } from '@/lib/webrtc';
import { useSocket } from './useSocket';
import { useAuthStore } from '@/store/authStore';
import { useMeetingStore } from '@/store/meetingStore';

export const useWebRTC = () => {
  const { socket, emit, on } = useSocket();
  const { user } = useAuthStore();
  const { 
    participants, 
    setParticipants, 
    addParticipant, 
    removeParticipant,
    updateParticipant,
    isScreenSharing,
    setIsScreenSharing 
  } = useMeetingStore();

  const [webrtcService, setWebrtcService] = useState<WebRTCService | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize WebRTC service
  const initializeWebRTC = useCallback(async () => {
    if (!socket || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const rtcService = new WebRTCService(socket, user.id);
      const stream = await rtcService.initializeLocalStream();
      
      setWebrtcService(rtcService);
      setLocalStream(stream);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize WebRTC');
    } finally {
      setIsLoading(false);
    }
  }, [socket, user]);

  // Setup socket listeners
  useEffect(() => {
    if (!socket || !webrtcService) return;

    const cleanupUserJoined = on('user-joined', (data) => {
      setParticipants(data.participants);
      if (data.user.id !== user?.id) {
        webrtcService.createOffer(data.user.id);
      }
    });

    const cleanupUserLeft = on('user-left', (data) => {
      removeParticipant(data.user.id);
    });

    const cleanupMedia = on('media-state-changed', (data) => {
      updateParticipant(data.userId, {
        [data.type]: data.isVideoOn || data.isAudioOn
      });
    });

    const cleanupScreen = on('screen-share-user-changed', (data) => {
      setIsScreenSharing(!!data.screenSharingUserId);
    });

    return () => {
      cleanupUserJoined();
      cleanupUserLeft();
      cleanupMedia();
      cleanupScreen();
    };
  }, [socket, webrtcService, user?.id, setParticipants, removeParticipant, updateParticipant, setIsScreenSharing, on]);

  // Toggle video
  const toggleVideo = useCallback((isEnabled: boolean) => {
    if (webrtcService) {
      webrtcService.toggleVideo(isEnabled);
      emit('toggle-video', { isVideoOn: isEnabled });
    }
  }, [webrtcService, emit]);

  // Toggle audio
  const toggleAudio = useCallback((isEnabled: boolean) => {
    if (webrtcService) {
      webrtcService.toggleAudio(isEnabled);
      emit('toggle-audio', { isAudioOn: isEnabled });
    }
  }, [webrtcService, emit]);

  // Start screen share
  const startScreenShare = useCallback(async () => {
    if (webrtcService) {
      try {
        await webrtcService.startScreenShare();
        emit('screen-share-start');
        setIsScreenSharing(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to start screen share');
      }
    }
  }, [webrtcService, emit, setIsScreenSharing]);

  // Stop screen share
  const stopScreenShare = useCallback(() => {
    if (webrtcService) {
      webrtcService.stopScreenShare();
      emit('screen-share-stop');
      setIsScreenSharing(false);
    }
  }, [webrtcService, emit, setIsScreenSharing]);

  // Cleanup
  const cleanup = useCallback(() => {
    if (webrtcService) {
      webrtcService.cleanup();
      setWebrtcService(null);
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
  }, [webrtcService, localStream]);

  return {
    webrtcService,
    localStream,
    isLoading,
    error,
    initializeWebRTC,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
    cleanup,
  };
};
