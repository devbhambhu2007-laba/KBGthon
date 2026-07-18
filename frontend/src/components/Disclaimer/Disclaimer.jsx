import React from 'react';

const text = "This application is not a diagnostic tool. It cannot identify bacterial infection or prescribe treatment. Always consult a registered medical practitioner.";

export default function Disclaimer({ variant = 'inline' }) {
  if (variant === 'banner') {
    return (
      <div className="disclaimer-banner fixed bottom-0 left-0 w-full p-4 z-50 text-center text-sm font-medium">
        <p className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{text}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card border-l-4 border-l-amber-500 p-4 my-4 flex gap-3 text-amber-200 text-sm">
      <svg className="w-6 h-6 flex-shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p>{text}</p>
    </div>
  );
}
