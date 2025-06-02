import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import interviewReducer from './slices/interviewSlice';
import recordingReducer from './slices/recordingSlice';
import monitoringReducer from './slices/monitoringSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    interview: interviewReducer,
    recording: recordingReducer,
    monitoring: monitoringReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in specific action types
        ignoredActions: ['recording/setStream', 'recording/setMediaRecorder'],
        // Ignore non-serializable paths
        ignoredPaths: ['recording.stream', 'recording.mediaRecorder'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 