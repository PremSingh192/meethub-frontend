'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Video, Calendar, Users, Clock } from 'lucide-react';
import { Button, Modal, Input } from '@/components/ui';
import { useMeeting } from '@/hooks/useMeeting';
import { useAuth } from '@/hooks/useAuth';
import { Room } from '@/types';
import { formatDate, formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { getUserRooms, createRoom } = useMeeting();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomPassword, setNewRoomPassword] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [joinRoomPassword, setJoinRoomPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const userRooms = await getUserRooms();
      // Ensure rooms is always an array, even if getUserRooms returns null/undefined
      setRooms(Array.isArray(userRooms) ? userRooms : []);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      toast.error('Failed to load rooms');
      setRooms([]); // Ensure rooms is an empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomTitle.trim()) {
      toast.error('Please enter a room title');
      return;
    }

    setIsCreating(true);
    try {
      console.log('Creating room with title:', newRoomTitle);
      const room = await createRoom(newRoomTitle, newRoomPassword || undefined);
      console.log('Room created successfully:', room);
      
      if (room) {
        setShowCreateModal(false);
        setNewRoomTitle('');
        setNewRoomPassword('');
        
        // Use room_code instead of roomCode
        const roomCode = room.room_code;
        console.log('Navigating to room with code:', roomCode);
        router.push(`/meetings/${roomCode}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinRoomCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }

    setIsJoining(true);
    try {
      router.push(`/meetings/${joinRoomCode}`);
    } finally {
      setIsJoining(false);
    }
  };

  const handleRoomClick = (room: Room) => {
    const roomCode = room.room_code;
    console.log('Clicking room with code:', roomCode);
    router.push(`/meetings/${roomCode}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || user?.email}!
          </h1>
          <p className="text-gray-600">
            Start or join a meeting to connect with your team.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <PlusCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">New Meeting</h3>
                  <p className="text-sm text-gray-600">Create a new meeting room</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="w-full"
              icon={<PlusCircle className="w-4 h-4" />}
            >
              Create Meeting
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Video className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Join Meeting</h3>
                  <p className="text-sm text-gray-600">Join with a room code</p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowJoinModal(true)}
              className="w-full"
              icon={<Video className="w-4 h-4" />}
            >
              Join Meeting
            </Button>
          </div>
        </div>

        {/* Recent Rooms */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Recent Rooms</h2>
          {rooms.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms yet</h3>
              <p className="text-gray-600 mb-4">Create your first meeting room to get started</p>
              <Button
                onClick={() => setShowCreateModal(true)}
                icon={<PlusCircle className="w-4 h-4" />}
              >
                Create Your First Room
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleRoomClick(room)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{room.title}</h3>
                      <p className="text-sm text-gray-600">Room: {room.room_code}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {room.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{room.participants?.length || 0} participants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(room.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Room Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Meeting"
        >
          <div className="space-y-4">
            <Input
              label="Meeting Title"
              placeholder="Enter meeting title"
              value={newRoomTitle}
              onChange={(e) => setNewRoomTitle(e.target.value)}
            />
            <Input
              label="Password (Optional)"
              type="password"
              placeholder="Enter password for private meeting"
              value={newRoomPassword}
              onChange={(e) => setNewRoomPassword(e.target.value)}
            />
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRoom}
                loading={isCreating}
                className="flex-1"
              >
                Create Meeting
              </Button>
            </div>
          </div>
        </Modal>

        {/* Join Room Modal */}
        <Modal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          title="Join Meeting"
        >
          <div className="space-y-4">
            <Input
              label="Room Code"
              placeholder="Enter 8-digit room code"
              value={joinRoomCode}
              onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
              maxLength={8}
            />
            <Input
              label="Password (if required)"
              type="password"
              placeholder="Enter meeting password"
              value={joinRoomPassword}
              onChange={(e) => setJoinRoomPassword(e.target.value)}
            />
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowJoinModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoinRoom}
                loading={isJoining}
                className="flex-1"
              >
                Join Meeting
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
