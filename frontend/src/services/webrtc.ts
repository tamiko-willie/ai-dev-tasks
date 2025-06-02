interface MediaRecorderOptions {
  mimeType: string;
  audioBitsPerSecond?: number;
  videoBitsPerSecond?: number;
}

class VideoRecordingService {
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private isRecording = false;

  async initializeStream(): Promise<MediaStream> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
      });
      return this.stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw new Error('Failed to access camera and microphone');
    }
  }

  async startRecording(options: Partial<MediaRecorderOptions> = {}): Promise<void> {
    if (!this.stream) {
      await this.initializeStream();
    }

    if (!this.stream) {
      throw new Error('Media stream not initialized');
    }

    const defaultOptions: MediaRecorderOptions = {
      mimeType: 'video/webm;codecs=vp9,opus',
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
    };

    const finalOptions = { ...defaultOptions, ...options };

    try {
      this.mediaRecorder = new MediaRecorder(this.stream, finalOptions);
    } catch (e) {
      // Fallback to default codec if VP9 is not supported
      finalOptions.mimeType = 'video/webm';
      this.mediaRecorder = new MediaRecorder(this.stream, finalOptions);
    }

    this.chunks = [];
    this.isRecording = true;

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  stopRecording(): Promise<Blob> {
    if (!this.mediaRecorder || !this.isRecording) {
      throw new Error('No recording in progress');
    }

    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = () => {
        const recordedBlob = new Blob(this.chunks, { type: 'video/webm' });
        this.chunks = [];
        this.isRecording = false;
        resolve(recordedBlob);
      };

      this.mediaRecorder!.stop();
    });
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.pause();
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.resume();
    }
  }

  stopStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  getRecordingState(): 'inactive' | 'recording' | 'paused' {
    return this.mediaRecorder ? this.mediaRecorder.state : 'inactive';
  }

  isStreamActive(): boolean {
    return this.stream !== null && this.stream.active;
  }

  async takeSnapshot(): Promise<Blob> {
    if (!this.stream) {
      throw new Error('Media stream not initialized');
    }

    const videoTrack = this.stream.getVideoTracks()[0];
    if (!videoTrack) {
      throw new Error('No video track available');
    }

    const imageCapture = new ImageCapture(videoTrack);
    const bitmap = await imageCapture.grabFrame();
    
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to create canvas context');
    }
    
    context.drawImage(bitmap, 0, 0);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Failed to create snapshot');
        }
      }, 'image/jpeg', 0.95);
    });
  }
}

export const videoRecordingService = new VideoRecordingService(); 