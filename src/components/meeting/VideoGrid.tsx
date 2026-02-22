'use client';

import React, { useRef } from 'react';
import { VideoTile } from './VideoTile';
import { Participant } from '@/types';
import { useMeetingStore } from '@/store/meetingStore';

interface VideoGridProps {
  participants: Participant[];
  localVideoRef?: React.RefObject<HTMLVideoElement>;
  isScreenSharing?: boolean;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
  localVideoRef,
  isScreenSharing = false,
}) => {
  const { localMediaState } = useMeetingStore();

  const getGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-3';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  const renderLocalVideo = () => {
    if (!localVideoRef?.current) return null;

    const localParticipant: Participant = {
      id: 'local',
      user: {
        id: 'local',
        email: 'local@example.com',
        name: 'You',
        createdAt: new Date().toISOString(),
      },
      isVideoOn: localMediaState.isVideoOn,
      isAudioOn: localMediaState.isAudioOn,
      isScreenSharing: isScreenSharing,
      joinedAt: new Date().toISOString(),
    };

    return (
      <VideoTile
        key="local"
        participant={localParticipant}
        isLocal={true}
        stream={localVideoRef.current.srcObject as MediaStream}
        className="aspect-video"
      />
    );
  };

  const renderParticipantVideo = (participant: Participant) => {
    return (
      <VideoTile
        key={participant.user.id}
        participant={participant}
        className="aspect-video"
      />
    );
  };

  const renderScreenShare = () => {
    if (!isScreenSharing) return null;

    return (
      <div className="col-span-full">
        <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video">
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🖥️</span>
              </div>
              <p>Screen sharing in progress</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const totalVideos = participants.length + 1; // +1 for local video
  const gridClass = getGridClass(totalVideos);

  return (
    <div className={`grid ${gridClass} gap-4 p-4 h-full`}>
      {/* Screen Share takes full width if active */}
      {isScreenSharing && renderScreenShare()}

      {/* Local Video */}
      {!isScreenSharing && renderLocalVideo()}

      {/* Participant Videos */}
      {participants.map(renderParticipantVideo)}

      {/* Empty states for grid layout */}
      {totalVideos < 4 && !isScreenSharing && (
        Array.from({ length: 4 - totalVideos }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center"
          >
            <div className="text-gray-600">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl">+</span>
              </div>
              <p className="text-sm mt-2">Waiting for participants</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
