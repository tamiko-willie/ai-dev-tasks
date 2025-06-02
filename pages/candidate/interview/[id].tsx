import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress,
  Alert,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import ReplayIcon from '@mui/icons-material/Replay';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';

interface Question {
  id: string;
  text: string;
  duration: number; // in seconds
  preparationTime: number; // in seconds
}

const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'Tell us about your most challenging project and how you overcame the obstacles.',
    duration: 180, // 3 minutes
    preparationTime: 60 // 1 minute
  },
  {
    id: '2',
    text: 'How do you stay updated with the latest industry trends and technologies?',
    duration: 120, // 2 minutes
    preparationTime: 45 // 45 seconds
  },
  {
    id: '3',
    text: 'Describe a situation where you had to work with a difficult team member.',
    duration: 180, // 3 minutes
    preparationTime: 60 // 1 minute
  }
];

export default function CandidateInterview() {
  const router = useRouter();
  const { id } = router.query;
  const theme = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPreparing, setIsPreparing] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [deviceStatus, setDeviceStatus] = useState({
    video: false,
    audio: false
  });
  const [showDeviceTest, setShowDeviceTest] = useState(true);

  useEffect(() => {
    // Initialize devices and permissions
    const initializeDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        setDeviceStatus({
          video: true,
          audio: true
        });
        
        // Initialize MediaRecorder
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };
        
        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' });
          chunksRef.current = [];
          await handleUploadRecording(blob);
        };

        setIsLoading(false);
      } catch (err) {
        setError('Failed to access camera or microphone. Please check your device permissions.');
        setIsLoading(false);
      }
    };

    if (id) {
      initializeDevices();
    }

    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [id]);

  const startRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      chunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTimeLeft(mockQuestions[currentQuestionIndex].duration);
      
      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleUploadRecording = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('video', blob);
      formData.append('questionId', mockQuestions[currentQuestionIndex].id);
      formData.append('interviewId', id as string);

      const response = await fetch('/api/interviews/submit-recording', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload recording');
      }

      // Move to next question or finish interview
      if (currentQuestionIndex < mockQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsPreparing(true);
        setTimeLeft(mockQuestions[currentQuestionIndex + 1].preparationTime);
      } else {
        // Interview completed
        router.push('/candidate/interview/complete');
      }
    } catch (err) {
      setError('Failed to upload recording. Please try again.');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Virtual Interview - Question {currentQuestionIndex + 1}</title>
        <meta name="description" content="Virtual interview recording session" />
      </Head>

      <Container component="main" maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Paper sx={{ p: 4 }}>
            {/* Device Test Dialog */}
            <Dialog
              open={showDeviceTest}
              aria-labelledby="device-test-dialog-title"
            >
              <DialogTitle id="device-test-dialog-title">
                Device Test
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    Please check your devices:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <VideocamIcon color={deviceStatus.video ? 'success' : 'error'} sx={{ mr: 1 }} />
                    <Typography>
                      Camera: {deviceStatus.video ? 'Working' : 'Not available'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MicIcon color={deviceStatus.audio ? 'success' : 'error'} sx={{ mr: 1 }} />
                    <Typography>
                      Microphone: {deviceStatus.audio ? 'Working' : 'Not available'}
                    </Typography>
                  </Box>
                </Box>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{ width: '100%', borderRadius: theme.shape.borderRadius }}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setShowDeviceTest(false)}
                  variant="contained"
                  disabled={!deviceStatus.video || !deviceStatus.audio}
                >
                  Start Interview
                </Button>
              </DialogActions>
            </Dialog>

            {/* Main Interview Interface */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Question {currentQuestionIndex + 1} of {mockQuestions.length}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {mockQuestions[currentQuestionIndex].text}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {isPreparing ? 'Preparation' : 'Recording'} time remaining: {formatTime(timeLeft)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(timeLeft / (isPreparing ? 
                    mockQuestions[currentQuestionIndex].preparationTime : 
                    mockQuestions[currentQuestionIndex].duration)) * 100}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: '100%',
                  maxWidth: '640px',
                  borderRadius: theme.shape.borderRadius
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              {isPreparing ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => {
                    setIsPreparing(false);
                    startRecording();
                  }}
                  disabled={isRecording}
                >
                  Start Recording
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={stopRecording}
                  disabled={!isRecording}
                >
                  Stop Recording
                </Button>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
} 