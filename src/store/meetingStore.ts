import { create } from 'zustand';
import { Participant, ChatMessage, Room } from '@/types';

interface MeetingState {
  currentRoom: Room | null;
  participants: Participant[];
  chatMessages: ChatMessage[];
  isScreenSharing: boolean;
  isRecording: boolean;
  isHandRaised: boolean;
  localMediaState: {
    isVideoOn: boolean;
    isAudioOn: boolean;
  };
  
  setCurrentRoom: (room: Room | null) => void;
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (userId: string, updates: Partial<Participant>) => void;
  
  setChatMessages: (messages: ChatMessage[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;
  
  setIsScreenSharing: (isSharing: boolean) => void;
  setIsRecording: (isRecording: boolean) => void;
  setIsHandRaised: (isRaised: boolean) => void;
  
  setLocalMediaState: (state: { isVideoOn: boolean; isAudioOn: boolean }) => void;
  toggleLocalVideo: () => void;
  toggleLocalAudio: () => void;
  
  resetMeetingState: () => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  currentRoom: null,
  participants: [],
  chatMessages: [],
  isScreenSharing: false,
  isRecording: false,
  isHandRaised: false,
  localMediaState: {
    isVideoOn: true,
    isAudioOn: true,
  },

  setCurrentRoom: (room) => set({ currentRoom: room }),

  setParticipants: (participants) => set({ participants }),

  addParticipant: (participant) => set((state) => ({
    participants: [...state.participants, participant]
  })),

  removeParticipant: (userId) => set((state) => ({
    participants: state.participants.filter(p => p.user.id !== userId)
  })),

  updateParticipant: (userId, updates) => set((state) => ({
    participants: state.participants.map(p => 
      p.user.id === userId ? { ...p, ...updates } : p
    )
  })),

  setChatMessages: (messages) => set({ chatMessages: messages }),

  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message]
  })),

  clearChatMessages: () => set({ chatMessages: [] }),

  setIsScreenSharing: (isSharing) => set({ isScreenSharing: isSharing }),

  setIsRecording: (isRecording) => set({ isRecording }),

  setIsHandRaised: (isRaised) => set({ isHandRaised: isRaised }),

  setLocalMediaState: (state) => set({ localMediaState: state }),

  toggleLocalVideo: () => set((state) => ({
    localMediaState: {
      ...state.localMediaState,
      isVideoOn: !state.localMediaState.isVideoOn
    }
  })),

  toggleLocalAudio: () => set((state) => ({
    localMediaState: {
      ...state.localMediaState,
      isAudioOn: !state.localMediaState.isAudioOn
    }
  })),

  resetMeetingState: () => set({
    currentRoom: null,
    participants: [],
    chatMessages: [],
    isScreenSharing: false,
    isRecording: false,
    isHandRaised: false,
    localMediaState: {
      isVideoOn: true,
      isAudioOn: true,
    },
  }),
}));
