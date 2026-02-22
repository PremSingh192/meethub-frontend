export const APP_CONFIG = {
  NAME: 'Google Meet Clone',
  VERSION: '1.0.0',
  DESCRIPTION: 'A modern video conferencing application built with Next.js and WebRTC',
};

export const API_ENDPOINTS = {
  AUTH: {
    SEND_OTP: '/api/auth/send-otp',
    VERIFY_OTP: '/api/auth/verify-otp',
    PROFILE: '/api/auth/profile',
  },
  MEETINGS: {
    ROOMS: '/api/meetings/rooms',
    JOIN: '/api/meetings/join',
    LEAVE: '/api/meetings/leave',
    MY_ROOMS: '/api/meetings/my-rooms',
  },
};

export const MEDIA_CONSTRAINTS = {
  VIDEO: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user',
  },
  AUDIO: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  SCREEN_SHARE: {
    video: {
      cursor: 'always',
    },
    audio: true,
  },
};

export const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
];

export const TOAST_CONFIG = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    background: '#1f2937',
    color: '#f3f4f6',
    border: '1px solid #374151',
  },
  successStyle: {
    background: '#065f46',
    color: '#f3f4f6',
    border: '1px solid #047857',
  },
  errorStyle: {
    background: '#7f1d1d',
    color: '#f3f4f6',
    border: '1px solid #991b1b',
  },
};
