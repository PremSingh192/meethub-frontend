'use client';

import React from 'react';
import { Users, Crown, Hand, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { Participant } from '@/types';
import { formatTime } from '@/lib/utils';

interface ParticipantsListProps {
  participants: Participant[];
  className?: string;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  className = '',
}) => {
  const sortedParticipants = [...participants].sort((a, b) => {
    // Sort by host (first joined) then by name
    if (a.joinedAt < b.joinedAt) return -1;
    if (a.joinedAt > b.joinedAt) return 1;
    return (a.user.name || a.user.email).localeCompare(b.user.name || b.user.email);
  });

  return (
    <div className={`flex flex-col h-full bg-gray-800 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Participants ({participants.length + 1})
          </h3>
        </div>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Local User (You) */}
        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-white">YO</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-white">You</span>
                <Crown className="w-3 h-3 text-yellow-500" />
              </div>
              <span className="text-xs text-gray-400">Host</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
              <Mic className="w-3 h-3 text-gray-300" />
            </div>
            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
              <Video className="w-3 h-3 text-gray-300" />
            </div>
          </div>
        </div>

        {/* Other Participants */}
        {sortedParticipants.map((participant, index) => {
          const displayName = participant.user.name || participant.user.email;
          const initials = displayName
            .split(' ')
            .map((word: string) => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          const isHost = index === 0;

          return (
            <div
              key={participant.user.id}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-300">
                    {initials}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">
                      {displayName}
                    </span>
                    {isHost && <Crown className="w-3 h-3 text-yellow-500" />}
                    {participant.isHandRaised && (
                      <Hand className="w-3 h-3 text-yellow-500" />
                    )}
                  </div>
                  <span className="text-xs text-gray-400">
                    Joined {formatTime(participant.joinedAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  participant.isAudioOn
                    ? 'bg-green-600'
                    : 'bg-red-600'
                }`}>
                  {participant.isAudioOn ? (
                    <Mic className="w-3 h-3 text-white" />
                  ) : (
                    <MicOff className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  participant.isVideoOn
                    ? 'bg-green-600'
                    : 'bg-red-600'
                }`}>
                  {participant.isVideoOn ? (
                    <Video className="w-3 h-3 text-white" />
                  ) : (
                    <VideoOff className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {participants.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No other participants</p>
            <p className="text-sm mt-2">Waiting for others to join...</p>
          </div>
        )}
      </div>
    </div>
  );
};
