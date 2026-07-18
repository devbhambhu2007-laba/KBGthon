import React from 'react';
import RiskGauge from './RiskGauge';
import ReasonCard from './ReasonCard';

export default function RiskResult({ data }) {
  if (!data) return null;

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in">
      <h2 className="text-2xl font-bold font-heading text-center mb-8 text-white">Assessment Results</h2>
      
      <div className="flex justify-center mb-10">
        <RiskGauge score={data.score} size={240} />
      </div>

      {data.reasons && data.reasons.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Risk Factors Identified
          </h3>
          <div className="space-y-1">
            {data.reasons.map((reason, idx) => (
              <ReasonCard key={idx} reason={reason} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
