'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VideoGrid, MeetingControls, ChatPanel, ParticipantsList } from '@/components/meeting';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useMeeting } from '@/hooks/useMeeting';
import { useAuth } from '@/hooks/useAuth';
import { PageLoading } from '@/components/ui';
import toast from 'react-hot-toast';

export default function MeetingRoomPage() {
  const params = useParams();
  const roomCode = params.roomCode as string;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { joinRoom, leaveRoom, sendMessage } = useMeeting();
  const { 
    webrtcService, 
    localStream, 
    isLoading: webrtcLoading, 
    initializeWebRTC, 
    toggleVideo, 
    toggleAudio, 
    startScreenShare, 
    stopScreenShare,
    cleanup 
  } = useWebRTC();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const initializeMeeting = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Join the meeting room
        const room = await joinRoom(roomCode);
        if (!room) {
          throw new Error('Failed to join room');
        }

        // Initialize WebRTC
        await initializeWebRTC();

        // Set local video stream
        if (localStream && localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        toast.success('Joined meeting successfully');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to join meeting';
        setError(errorMessage);
        toast.error(errorMessage);
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    initializeMeeting();

    return () => {
      cleanup();
    };
  }, [isAuthenticated, roomCode, router, joinRoom, initializeWebRTC, localStream, cleanup]);

  const handleLeaveMeeting = async () => {
    try {
      await leaveRoom();
    } catch (err) {
      console.error('Error leaving meeting:', err);
    }
  };

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  if (isLoading || webrtcLoading) {
    return <PageLoading text="Joining meeting..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Main Video Area */}
      <div className="flex-1 flex">
        <div className="flex-1 relative">
          {/* Hidden local video element for WebRTC */}
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="hidden"
            id="local-video"
          />

          <VideoGrid 
            participants={[]} // Will be populated by socket events
            localVideoRef={localVideoRef}
            isScreenSharing={false} // Will be updated by socket events
          />
          
          <MeetingControls
            onToggleVideo={toggleVideo}
            onToggleAudio={toggleAudio}
            onStartScreenShare={startScreenShare}
            onStopScreenShare={stopScreenShare}
            onLeaveMeeting={handleLeaveMeeting}
            isScreenSharing={false} // Will be updated by socket events
          />
        </div>

        {/* Side Panels */}
        <div className="w-80 bg-gray-800 flex flex-col">
          <ParticipantsList participants={[]} />
          <ChatPanel 
            messages={[]} // Will be populated by socket events
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
}
