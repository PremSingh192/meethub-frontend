'use client';

import React from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff, 
  PhoneOff,
  Users,
  MessageSquare,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useMeetingStore } from '@/store/meetingStore';

interface MeetingControlsProps {
  onToggleVideo: (isEnabled: boolean) => void;
  onToggleAudio: (isEnabled: boolean) => void;
  onStartScreenShare: () => void;
  onStopScreenShare: () => void;
  onLeaveMeeting?: () => void;
  isScreenSharing: boolean;
}

export const MeetingControls: React.FC<MeetingControlsProps> = ({
  onToggleVideo,
  onToggleAudio,
  onStartScreenShare,
  onStopScreenShare,
  onLeaveMeeting,
  isScreenSharing,
}) => {
  const { localMediaState, toggleLocalVideo, toggleLocalAudio } = useMeetingStore();

  const handleVideoToggle = () => {
    const newState = !localMediaState.isVideoOn;
    toggleLocalVideo();
    onToggleVideo(newState);
  };

  const handleAudioToggle = () => {
    const newState = !localMediaState.isAudioOn;
    toggleLocalAudio();
    onToggleAudio(newState);
  };

  const handleScreenShareToggle = () => {
    if (isScreenSharing) {
      onStopScreenShare();
    } else {
      onStartScreenShare();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm border-t border-gray-700">
      <div className="flex items-center justify-center space-x-4 p-4">
        {/* Audio Control */}
        <Button
          variant={localMediaState.isAudioOn ? 'secondary' : 'danger'}
          size="lg"
          onClick={handleAudioToggle}
          className="p-4 rounded-full"
          icon={localMediaState.isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        />

        {/* Video Control */}
        <Button
          variant={localMediaState.isVideoOn ? 'secondary' : 'danger'}
          size="lg"
          onClick={handleVideoToggle}
          className="p-4 rounded-full"
          icon={localMediaState.isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        />

        {/* Screen Share Control */}
        <Button
          variant={isScreenSharing ? 'secondary' : 'outline'}
          size="lg"
          onClick={handleScreenShareToggle}
          className="p-4 rounded-full"
          icon={isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
        />

        {/* Leave Meeting */}
        {onLeaveMeeting && (
          <Button
            variant="danger"
            size="lg"
            onClick={onLeaveMeeting}
            className="p-4 rounded-full"
            icon={<PhoneOff className="w-5 h-5" />}
          />
        )}
      </div>

      {/* Additional Controls */}
      <div className="flex items-center justify-center space-x-6 pb-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white"
          icon={<Users className="w-4 h-4" />}
        >
          Participants
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white"
          icon={<MessageSquare className="w-4 h-4" />}
        >
          Chat
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-gray-300 hover:text-white"
          icon={<Settings className="w-4 h-4" />}
        >
          Settings
        </Button>
      </div>
    </div>
  );
};
