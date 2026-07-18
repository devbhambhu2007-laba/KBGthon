import React from 'react';

export default function Emergency() {
  return (
    <div className="w-full max-w-[800px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-on-surface mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-error text-4xl" style={{fontVariationSettings: "'FILL' 1"}}>emergency</span>
        Emergency Help
      </h1>
      
      {/* Disclaimer Section */}
      <div className="bg-error-container/20 border border-error/50 rounded-lg p-5 mb-8 shadow-sm">
        <h2 className="text-error font-bold text-xl mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
          Medical Disclaimer
        </h2>
        <p className="text-on-surface mb-3">
          <strong>This platform is NOT a substitute for professional medical care or emergency services.</strong>
        </p>
        <p className="text-on-surface text-sm">
          If you are experiencing a severe allergic reaction, difficulty breathing, high unmanageable fever, or any other life-threatening condition, <strong>seek immediate emergency medical attention</strong> or call your local emergency number. Do not rely on this application for urgent medical decisions.
        </p>
      </div>

      <div className="bg-surface-container-low p-6 rounded-2xl shadow-sm border border-outline-variant space-y-4">
        <h2 className="text-xl font-semibold text-on-surface">When to See a Doctor Immediately</h2>
        <ul className="list-disc pl-5 text-on-surface-variant space-y-2">
          <li>Difficulty breathing or swallowing</li>
          <li>Severe rash or hives (possible allergic reaction to antibiotics)</li>
          <li>Persistent high fever despite taking prescribed medication</li>
          <li>Severe diarrhea, especially if bloody (possible C. diff infection)</li>
          <li>Confusion or altered mental state</li>
        </ul>
      </div>
    </div>
  );
}
