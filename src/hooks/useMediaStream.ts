'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { MEDIA_CONSTRAINTS } from '@/lib/constants';

export const useMediaStream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  const streamRef = useRef<MediaStream | null>(null);

  // Get user media stream
  const getMediaStream = useCallback(async (constraints?: MediaStreamConstraints) => {
    setIsLoading(true);
    setError(null);

    try {
      const mediaConstraints = constraints || {
        video: MEDIA_CONSTRAINTS.VIDEO,
        audio: MEDIA_CONSTRAINTS.AUDIO,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      streamRef.current = mediaStream;
      setStream(mediaStream);
      
      return mediaStream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access media devices';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  }, []);

  // Start screen share
  const startScreenShare = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: MEDIA_CONSTRAINTS.SCREEN_SHARE.video,
        audio: MEDIA_CONSTRAINTS.SCREEN_SHARE.audio,
      });

      return screenStream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start screen share';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Stop screen share
  const stopScreenShare = useCallback((screenStream: MediaStream) => {
    screenStream.getTracks().forEach(track => track.stop());
  }, []);

  // Cleanup stream
  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  // Auto-cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Update video/audio state when stream changes
  useEffect(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];
      
      setIsVideoOn(videoTrack?.enabled ?? false);
      setIsAudioOn(audioTrack?.enabled ?? false);
    }
  }, [stream]);

  return {
    stream,
    isLoading,
    error,
    isVideoOn,
    isAudioOn,
    getMediaStream,
    toggleVideo,
    toggleAudio,
    startScreenShare,
    stopScreenShare,
    cleanup,
  };
};
