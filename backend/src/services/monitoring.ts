interface MonitoringData {
  screenRecording: {
    timestamp: number;
    activeWindow: string;
    tabChanges: number;
  };
  webcamData: {
    timestamp: number;
    faceVisible: boolean;
    multipleFaces: boolean;
    lookingAway: boolean;
    speaking: boolean;
  };
  audioData: {
    timestamp: number;
    backgroundNoise: number;
    multipleSpeakers: boolean;
    suddenChanges: boolean;
  };
  systemEvents: {
    timestamp: number;
    clipboardAccess: boolean;
    keyboardShortcuts: string[];
    browserActions: string[];
  };
}

export const detectCheating = async (data: MonitoringData): Promise<string[]> => {
  const suspiciousActivities: string[] = [];

  // Check screen recording data
  if (data.screenRecording.tabChanges > 2) {
    suspiciousActivities.push('Excessive tab switching detected');
  }

  if (!data.screenRecording.activeWindow.includes('interview')) {
    suspiciousActivities.push('Candidate switched to different application');
  }

  // Check webcam data
  if (!data.webcamData.faceVisible) {
    suspiciousActivities.push('Face not visible in camera');
  }

  if (data.webcamData.multipleFaces) {
    suspiciousActivities.push('Multiple faces detected in camera');
  }

  if (data.webcamData.lookingAway) {
    suspiciousActivities.push('Candidate looking away from camera');
  }

  // Check audio data
  if (data.audioData.backgroundNoise > 0.7) {
    suspiciousActivities.push('High background noise detected');
  }

  if (data.audioData.multipleSpeakers) {
    suspiciousActivities.push('Multiple speakers detected');
  }

  if (data.audioData.suddenChanges) {
    suspiciousActivities.push('Sudden audio changes detected');
  }

  // Check system events
  if (data.systemEvents.clipboardAccess) {
    suspiciousActivities.push('Clipboard access detected');
  }

  const suspiciousShortcuts = data.systemEvents.keyboardShortcuts.filter(shortcut =>
    ['ctrl+c', 'ctrl+v', 'alt+tab'].includes(shortcut.toLowerCase())
  );

  if (suspiciousShortcuts.length > 0) {
    suspiciousActivities.push('Suspicious keyboard shortcuts used');
  }

  const suspiciousBrowserActions = data.systemEvents.browserActions.filter(action =>
    ['new_tab', 'new_window', 'download'].includes(action.toLowerCase())
  );

  if (suspiciousBrowserActions.length > 0) {
    suspiciousActivities.push('Suspicious browser actions detected');
  }

  return suspiciousActivities;
}; 