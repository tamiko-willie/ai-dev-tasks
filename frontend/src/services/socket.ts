import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
          query: { sessionId },
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
          console.log('Socket connected');
          this.reconnectAttempts = 0;
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.reconnectAttempts++;
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            reject(new Error('Failed to connect to server'));
          }
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
          if (reason === 'io server disconnect') {
            this.socket?.connect();
          }
        });

      } catch (error) {
        console.error('Socket initialization error:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Interview session events
  onInterviewStart(callback: () => void): void {
    this.socket?.on('interview:start', callback);
  }

  onInterviewEnd(callback: () => void): void {
    this.socket?.on('interview:end', callback);
  }

  onQuestionChange(callback: (questionIndex: number) => void): void {
    this.socket?.on('question:change', callback);
  }

  // Monitoring events
  emitMonitoringData(data: {
    timestamp: number;
    screenRecording: {
      activeWindow: string;
      tabChanges: number;
    };
    webcamData: {
      faceVisible: boolean;
      multipleFaces: boolean;
      lookingAway: boolean;
      speaking: boolean;
    };
    audioData: {
      backgroundNoise: number;
      multipleSpeakers: boolean;
      suddenChanges: boolean;
    };
    systemEvents: {
      clipboardAccess: boolean;
      keyboardShortcuts: string[];
      browserActions: string[];
    };
  }): void {
    this.socket?.emit('monitoring:data', data);
  }

  onSuspiciousActivity(callback: (activities: string[]) => void): void {
    this.socket?.on('monitoring:suspicious', callback);
  }

  // Recording status events
  emitRecordingStatus(status: 'started' | 'stopped' | 'paused' | 'resumed'): void {
    this.socket?.emit('recording:status', status);
  }

  onRecordingCommand(
    callback: (command: 'start' | 'stop' | 'pause' | 'resume') => void
  ): void {
    this.socket?.on('recording:command', callback);
  }

  // Connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Error handling
  onError(callback: (error: Error) => void): void {
    this.socket?.on('error', callback);
  }

  // Custom event emitter and listener
  emit(event: string, data: any): void {
    this.socket?.emit(event, data);
  }

  on(event: string, callback: (data: any) => void): void {
    this.socket?.on(event, callback);
  }

  // Remove event listeners
  off(event: string): void {
    this.socket?.off(event);
  }
}

export const socketService = new SocketService(); 