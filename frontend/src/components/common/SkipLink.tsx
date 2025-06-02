import React from 'react';
import { SkipLinkProps } from '../../utils/accessibility';

export const SkipLink: React.FC<SkipLinkProps> = ({ targetId, children }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.tabIndex = -1;
      target.focus();
      target.addEventListener(
        'blur',
        () => {
          target.tabIndex = 0;
        },
        { once: true }
      );
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-50
        bg-blue-600 text-white
        px-4 py-2 rounded-md
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      "
    >
      {children}
    </a>
  );
}; 