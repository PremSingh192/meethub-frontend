import { SocketEvents } from '@/types/socket';

export class WebRTCService {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private socket: any = null;
  private userId: string = '';
  private screenStream: MediaStream | null = null;

  constructor(socket: any, userId: string) {
    this.socket = socket;
    this.userId = userId;
    this.setupSocketListeners();
  }

  async initializeLocalStream(): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  createPeerConnection(targetUserId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    // Add local stream to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit(SocketEvents.ICE_CANDIDATE, {
          target: targetUserId,
          candidate: event.candidate,
        });
      }
    };

    // Handle remote stream
    pc.ontrack = (event) => {
      const remoteVideo = document.getElementById(`video-${targetUserId}`) as HTMLVideoElement;
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${targetUserId}:`, pc.connectionState);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.cleanupPeerConnection(targetUserId);
      }
    };

    this.peerConnections.set(targetUserId, pc);
    return pc;
  }

  async createOffer(targetUserId: string): Promise<void> {
    const pc = this.createPeerConnection(targetUserId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    this.socket.emit(SocketEvents.OFFER, {
      target: targetUserId,
      offer: offer,
    });
  }

  async handleOffer(data: { from: string; offer: RTCSessionDescriptionInit }): Promise<void> {
    const pc = this.createPeerConnection(data.from);
    await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    this.socket.emit(SocketEvents.ANSWER, {
      target: data.from,
      answer: answer,
    });
  }

  async handleAnswer(data: { from: string; answer: RTCSessionDescriptionInit }): Promise<void> {
    const pc = this.peerConnections.get(data.from);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
    }
  }

  async handleIceCandidate(data: { from: string; candidate: RTCIceCandidateInit }): Promise<void> {
    const pc = this.peerConnections.get(data.from);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  }

  toggleVideo(isEnabled: boolean): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isEnabled;
      }
    }
  }

  toggleAudio(isEnabled: boolean): void {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isEnabled;
      }
    }
  }

  async startScreenShare(): Promise<MediaStream> {
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const videoTrack = this.screenStream.getVideoTracks()[0];

      // Replace video track in all peer connections
      this.peerConnections.forEach(pc => {
        const sender = pc.getSenders().find(
          s => s.track && s.track.kind === 'video'
        );
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      // Handle screen share end
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      return this.screenStream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      throw error;
    }
  }

  stopScreenShare(): void {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }

    // Restore camera video
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      this.peerConnections.forEach(pc => {
        const sender = pc.getSenders().find(
          s => s.track && s.track.kind === 'video'
        );
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });
    }
  }

  private setupSocketListeners(): void {
    this.socket.on(SocketEvents.OFFER, this.handleOffer.bind(this));
    this.socket.on(SocketEvents.ANSWER, this.handleAnswer.bind(this));
    this.socket.on(SocketEvents.ICE_CANDIDATE, this.handleIceCandidate.bind(this));
  }

  private cleanupPeerConnection(userId: string): void {
    const pc = this.peerConnections.get(userId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(userId);
    }
  }

  cleanup(): void {
    this.peerConnections.forEach(pc => pc.close());
    this.peerConnections.clear();
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
    }
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  isScreenSharing(): boolean {
    return !!this.screenStream;
  }
}
