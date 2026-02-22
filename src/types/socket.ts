export const SocketEvents = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Room events
  JOIN_ROOM: 'join-room',
  LEAVE_ROOM: 'leave-room',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',

  // WebRTC signaling
  OFFER: 'offer',
  ANSWER: 'answer',
  ICE_CANDIDATE: 'ice-candidate',

  // Media events
  TOGGLE_VIDEO: 'toggle-video',
  TOGGLE_AUDIO: 'toggle-audio',
  MEDIA_STATE_CHANGED: 'media-state-changed',

  // Screen sharing
  SCREEN_SHARE_START: 'screen-share-start',
  SCREEN_SHARE_STOP: 'screen-share-stop',
  SCREEN_SHARE_USER_CHANGED: 'screen-share-user-changed',

  // Chat
  CHAT_MESSAGE: 'chat-message',
} as const;

export interface SocketData {
  [SocketEvents.JOIN_ROOM]: {
    room_code: string;
  };
  [SocketEvents.USER_JOINED]: {
    user: any;
    participants: any[];
  };
  [SocketEvents.USER_LEFT]: {
    user: any;
  };
  [SocketEvents.OFFER]: {
    target: string;
    offer: RTCSessionDescriptionInit;
  };
  [SocketEvents.ANSWER]: {
    target: string;
    answer: RTCSessionDescriptionInit;
  };
  [SocketEvents.ICE_CANDIDATE]: {
    target: string;
    candidate: RTCIceCandidateInit;
  };
  [SocketEvents.TOGGLE_VIDEO]: {
    isVideoOn: boolean;
  };
  [SocketEvents.TOGGLE_AUDIO]: {
    isAudioOn: boolean;
  };
  [SocketEvents.MEDIA_STATE_CHANGED]: {
    userId: string;
    type: 'isVideoOn' | 'isAudioOn';
    isVideoOn?: boolean;
    isAudioOn?: boolean;
  };
  [SocketEvents.SCREEN_SHARE_USER_CHANGED]: {
    screenSharingUserId?: string;
  };
  [SocketEvents.CHAT_MESSAGE]: {
    message: string;
  };
}
