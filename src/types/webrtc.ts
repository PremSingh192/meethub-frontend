export interface PeerConnection {
  userId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

export interface WebRTCConfig {
  iceServers: RTCIceServer[];
}

export interface MediaConstraints {
  video: boolean | MediaTrackConstraints;
  audio: boolean | MediaTrackConstraints;
}

export interface ScreenShareConstraints {
  video: MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
}
