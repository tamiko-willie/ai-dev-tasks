import { useState, useEffect } from 'react';

export const useHighContrastMode = (): boolean => {
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user has requested high contrast
    const mediaQuery = window.matchMedia('(forced-colors: active)');
    
    const updateHighContrast = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsHighContrast(e.matches);
    };

    // Set initial value
    updateHighContrast(mediaQuery);

    // Listen for changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateHighContrast);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(updateHighContrast);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', updateHighContrast);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(updateHighContrast);
      }
    };
  }, []);

  return isHighContrast;
}; 