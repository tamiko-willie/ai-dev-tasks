import { useEffect } from 'react';

// Focus trap for modals and dialogs
export const useFocusTrap = (containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstFocusable.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [containerRef]);
};

// Announce messages to screen readers
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'alert');
  announcement.setAttribute('aria-live', 'polite');
  announcement.style.position = 'absolute';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.padding = '0';
  announcement.style.margin = '-1px';
  announcement.style.overflow = 'hidden';
  announcement.style.clip = 'rect(0, 0, 0, 0)';
  announcement.style.whiteSpace = 'nowrap';
  announcement.style.border = '0';
  
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 3000);
};

// High contrast mode detection
export const useHighContrastMode = () => {
  const mediaQuery = window.matchMedia('(forced-colors: active)');
  return mediaQuery.matches;
};

// Motion reduction preference detection
export const useReducedMotion = () => {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return mediaQuery.matches;
};

// Keyboard navigation helper
export const handleKeyboardNavigation = (
  event: React.KeyboardEvent,
  actions: { [key: string]: () => void }
) => {
  if (actions[event.key]) {
    event.preventDefault();
    actions[event.key]();
  }
};

// Color contrast checker
export const checkColorContrast = (foreground: string, background: string): number => {
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  };

  const [r1, g1, b1] = hexToRgb(foreground);
  const [r2, g2, b2] = hexToRgb(background);

  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

// Skip link component props
export interface SkipLinkProps {
  targetId: string;
  children: React.ReactNode;
}

// Form field props with accessibility attributes
export interface AccessibleFormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

// Constants for ARIA labels and descriptions
export const ARIA_LABELS = {
  closeButton: 'Close',
  menuButton: 'Toggle menu',
  searchButton: 'Search',
  nextPage: 'Next page',
  previousPage: 'Previous page',
  loading: 'Loading...',
  error: 'Error',
  success: 'Success',
  required: 'Required field',
  optional: 'Optional',
  selected: 'Selected',
  expanded: 'Expanded',
  collapsed: 'Collapsed',
  play: 'Play',
  pause: 'Pause',
  mute: 'Mute',
  unmute: 'Unmute',
};

// Accessibility roles
export const ARIA_ROLES = {
  banner: 'banner',
  navigation: 'navigation',
  main: 'main',
  complementary: 'complementary',
  contentinfo: 'contentinfo',
  search: 'search',
  form: 'form',
  region: 'region',
  alert: 'alert',
  alertdialog: 'alertdialog',
  dialog: 'dialog',
  status: 'status',
  log: 'log',
  marquee: 'marquee',
  timer: 'timer',
  tooltip: 'tooltip',
}; 