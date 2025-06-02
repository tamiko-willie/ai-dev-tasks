// Extend the JSX namespace to include ARIA attributes
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Extend the HTMLAttributes interface to include ARIA attributes
declare namespace React {
  interface HTMLAttributes<T> extends AriaAttributes {
    // Add common ARIA attributes
    role?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    'aria-live'?: 'polite' | 'assertive' | 'off';
    'aria-hidden'?: boolean | 'true' | 'false';
    'aria-disabled'?: boolean | 'true' | 'false';
    'aria-required'?: boolean | 'true' | 'false';
    'aria-invalid'?: boolean | 'true' | 'false';
    'aria-expanded'?: boolean | 'true' | 'false';
    'aria-haspopup'?: boolean | 'true' | 'false' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    'aria-controls'?: string;
    'aria-owns'?: string;
    'aria-current'?: boolean | 'true' | 'false' | 'page' | 'step' | 'location' | 'date' | 'time';
  }
} 