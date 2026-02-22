'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Video, Calendar, Users, Search, Filter } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useMeeting } from '@/hooks/useMeeting';
import { Room } from '@/types';
import { formatDate, formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function MeetingsPage() {
  const router = useRouter();
  const { getUserRooms } = useMeeting();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = rooms.filter(room =>
        room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.roomCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRooms(filtered);
    } else {
      setFilteredRooms(rooms);
    }
  }, [searchTerm, rooms]);

  const loadRooms = async () => {
    try {
      const userRooms = await getUserRooms();
      setRooms(userRooms);
      setFilteredRooms(userRooms);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoomClick = (room: Room) => {
    router.push(`/meetings/${room.roomCode}`);
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Meetings</h1>
            <p className="text-gray-600">Manage and join your meeting rooms</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            New Meeting
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search meetings by title or room code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <Button variant="outline" icon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
        </div>

        {/* Meeting Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Rooms</p>
                <p className="text-xl font-semibold text-gray-900">{rooms.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Rooms</p>
                <p className="text-xl font-semibold text-gray-900">
                  {rooms.filter(r => r.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-xl font-semibold text-gray-900">
                  {rooms.reduce((sum, room) => sum + room.participants.length, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <PlusCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Created Today</p>
                <p className="text-xl font-semibold text-gray-900">
                  {rooms.filter(r => {
                    const today = new Date().toDateString();
                    const roomDate = new Date(r.createdAt).toDateString();
                    return today === roomDate;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Meetings List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Meeting Rooms</h2>
            
            {filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No rooms found' : 'No rooms yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Create your first meeting room to get started'
                  }
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    icon={<PlusCircle className="w-4 h-4" />}
                  >
                    Create Your First Room
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRoomClick(room)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        room.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <div>
                        <h3 className="font-medium text-gray-900">{room.title}</h3>
                        <p className="text-sm text-gray-600">Room: {room.roomCode}</p>
                        <p className="text-xs text-gray-500">
                          Created {formatDate(room.createdAt)} at {formatTime(room.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{room.participants.length}</span>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        room.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {room.isActive ? 'Active' : 'Inactive'}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRoomClick(room);
                        }}
                      >
                        {room.isActive ? 'Join' : 'View'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
