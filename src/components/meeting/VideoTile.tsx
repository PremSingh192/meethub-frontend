'use client';

import React, { useRef, useEffect } from 'react';
import { User, Mic, MicOff, Video, VideoOff, Monitor } from 'lucide-react';
import { Participant } from '@/types';

interface VideoTileProps {
  participant: Participant;
  isLocal?: boolean;
  stream?: MediaStream;
  isScreenShare?: boolean;
  className?: string;
}

export const VideoTile: React.FC<VideoTileProps> = ({
  participant,
  isLocal = false,
  stream,
  isScreenShare = false,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const displayName = participant.user.name || participant.user.email;
  const initials = displayName
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover"
        id={isLocal ? 'local-video' : `video-${participant.user.id}`}
      />

      {/* No Video Placeholder */}
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-semibold text-gray-300">
                {initials}
              </span>
            </div>
            <p className="text-gray-400 text-sm">{displayName}</p>
          </div>
        </div>
      )}

      {/* Overlay Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium">
              {displayName}
              {isLocal && ' (You)'}
            </span>
            {isScreenShare && (
              <div className="flex items-center text-blue-400">
                <Monitor className="w-4 h-4 mr-1" />
                <span className="text-xs">Screen Share</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Audio Status */}
            <div className={`p-1.5 rounded-full ${
              participant.isAudioOn 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {participant.isAudioOn ? (
                <Mic className="w-4 h-4" />
              ) : (
                <MicOff className="w-4 h-4" />
              )}
            </div>

            {/* Video Status */}
            <div className={`p-1.5 rounded-full ${
              participant.isVideoOn 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {participant.isVideoOn ? (
                <Video className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Connection Quality Indicator */}
      <div className="absolute top-2 right-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>
    </div>
  );
};
