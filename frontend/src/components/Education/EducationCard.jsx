import React from 'react';

const ICONS = ['biotech', 'coronavirus', 'health_and_safety', 'public', 'vaccines', 'science', 'eco', 'psychology', 'warning', 'gavel', 'group', 'medication'];
const COLORS = [
  'text-primary', 'bg-primary/10',
  'text-secondary', 'bg-secondary/10',
  'text-tertiary', 'bg-tertiary/10'
];

export default function EducationCard({ card, index }) {
  // Cycle through icons and colors to give variety
  const icon = ICONS[index % ICONS.length];
  const textColor = COLORS[(index % 3) * 2];
  const bgColor = COLORS[(index % 3) * 2 + 1];

  return (
    <div className="glass-panel p-xl rounded-xl relative group h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-lg">
        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center ${textColor}`}>
          <span className="material-symbols-outlined text-headline-md">{icon}</span>
        </div>
        <span className="font-label-caps text-label-caps text-on-surface-variant bg-white/5 px-sm py-xs rounded-full border border-white/5">
          SOURCE: {card.source}
        </span>
      </div>
      
      <h3 className="font-headline-md text-headline-md mb-md text-on-surface">{card.concept}</h3>
      
      <p className="text-on-surface-variant mb-xl font-body-md flex-grow">
        {card.explanation}
      </p>
      
      <div className="mt-auto pt-md border-t border-white/5 flex items-end justify-between">
        <div>
          <span className={`block ${textColor} font-bold text-headline-md`}>{card.impact}</span>
        </div>
      </div>
    </div>
  );
}
