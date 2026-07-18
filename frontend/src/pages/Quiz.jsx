import React from 'react';

export default function Quiz() {
  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-on-surface mb-6">AMR Quiz</h1>
      
      {/* Disclaimer Section */}
      <div className="bg-error-container/20 border border-error/50 rounded-lg p-4 mb-8 shadow-sm">
        <h2 className="text-error font-bold text-lg mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
          Disclaimer
        </h2>
        <p className="text-on-surface text-sm">
          This quiz is designed for educational and awareness purposes only. The information provided here does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns or before making decisions about antibiotic use.
        </p>
      </div>

      <div className="bg-surface-container-low p-6 rounded-2xl shadow-sm border border-outline-variant">
        <p className="text-on-surface text-lg">Quiz content coming soon...</p>
      </div>
    </div>
  );
}
