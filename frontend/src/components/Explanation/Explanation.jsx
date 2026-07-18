import React from 'react';

export default function Explanation({ explanation, loading }) {
  if (loading) {
    return (
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm h-full flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary animate-pulse"></div>
        <h2 className="text-headline-sm font-headline-sm text-primary border-b border-outline-variant pb-sm mb-md flex items-center gap-xs animate-pulse">
          <span className="material-symbols-outlined text-secondary">neurology</span>
          Automated Clinical Synthesis
        </h2>
        <div className="space-y-md animate-pulse">
          <div className="h-4 bg-surface-container-high rounded w-full"></div>
          <div className="h-4 bg-surface-container-high rounded w-5/6"></div>
          <div className="h-4 bg-surface-container-high rounded w-4/6"></div>
        </div>
      </section>
    );
  }

  if (!explanation) return null;

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm h-full flex flex-col relative overflow-hidden animate-fade-in mt-xl">
      <div className="flex items-center justify-between border-b border-outline-variant pb-sm mb-md">
        <h2 className="text-headline-sm font-headline-sm text-primary flex items-center gap-xs">
          <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>neurology</span>
          Automated Clinical Synthesis
        </h2>
        {explanation.filtered && (
          <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-2 py-1 rounded border border-outline-variant uppercase tracking-widest text-[10px]">
            Static Fallback
          </span>
        )}
      </div>
      
      <div className="text-on-surface-variant font-body-md text-body-md space-y-md">
        {explanation.explanation.split('\n').map((paragraph, idx) => (
          paragraph.trim() ? <p key={idx}>{paragraph}</p> : null
        ))}
      </div>
    </section>
  );
}
