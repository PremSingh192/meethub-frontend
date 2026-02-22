import { User } from "./auth";

export interface Room {
  id: string;
  title: string;
  room_code: string; // Changed from roomCode to room_code to match API
  password?: string;
  expires_at?: string; // Added from API response
  is_active: boolean; // Changed from isActive to is_active to match API
  created_at: string; // Changed from createdAt to created_at to match API
  invite_link?: string; // Added from API response
  createdBy?: string; // Made optional since API doesn't return it
  participants?: Participant[]; // Made optional since API doesn't return it
}

export interface Participant {
  id: string;
  user: User;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  isHandRaised?: boolean;
  joinedAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  isEmoji: boolean;
}

export interface MediaState {
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
}
