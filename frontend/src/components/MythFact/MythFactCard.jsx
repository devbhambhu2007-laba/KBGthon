import React, { useState } from 'react';

export default function MythFactCard({ data }) {
  const [isOpen, setIsOpen] = useState(false);

  const isMyth = data.type === 'Myth';

  return (
    <div 
      className={`glass-panel rounded-xl overflow-hidden cursor-pointer group mb-md transition-all duration-300 ${isOpen ? 'border-primary/50 bg-surface-bright/30' : ''}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="p-lg flex items-center justify-between">
        <div className="flex items-center gap-md">
          {isMyth ? (
            <span className="font-label-caps text-label-caps px-md py-xs rounded bg-error-container text-on-error-container">MYTH</span>
          ) : (
            <span className="font-label-caps text-label-caps px-md py-xs rounded bg-tertiary-container text-on-tertiary-container">FACT</span>
          )}
          <span className="font-body-lg text-body-lg text-on-surface">"{data.claim}"</span>
        </div>
        <span className={`material-symbols-outlined transition-transform duration-300 text-on-surface-variant ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </div>
      
      <div 
        className="transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: isOpen ? '500px' : '0px' }}
      >
        <div className="px-lg pb-lg text-on-surface-variant border-t border-white/5 pt-md">
          <p className="mb-sm">
            <strong className="text-primary">The Truth: </strong>
            {data.truth}
          </p>
          {data.source && (
            <a className="text-label-caps text-secondary underline hover:text-primary transition-colors inline-block mt-2" href="#">
              Source: {data.source}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
