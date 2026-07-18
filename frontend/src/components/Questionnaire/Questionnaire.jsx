import React, { useState } from 'react';

const SYMPTOMS = ["Fever", "Cough", "Cold", "Sore throat", "Runny nose", "Body ache", "Diarrhea", "Stomach ache", "Urinary pain", "Skin infection", "Wound/Cut", "Other"];
const ANTIBIOTICS = [
  "Amoxicillin (e.g. Mox, Augmentin)", 
  "Azithromycin (e.g. Azee, Zithromax)", 
  "Ciprofloxacin (e.g. Cifran)", 
  "Metronidazole (e.g. Flagyl)", 
  "Doxycycline / Tetracycline", 
  "Cephalosporin (e.g. Taxim, Ceftum)", 
  "Other / Don't know"
];

export default function Questionnaire({ onSubmit, loading }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    age: '',
    symptoms: [],
    doctor_consulted: false,
    antibiotic_prescribed: '',
    days_prescribed: '',
    days_completed: '',
    doses_skipped: false,
    self_medicated: false,
    prior_use_6mo: false
  });

  const update = (fields) => setData(prev => ({ ...prev, ...fields }));

  const toggleSymptom = (sym) => {
    if (data.symptoms.includes(sym)) {
      update({ symptoms: data.symptoms.filter(s => s !== sym) });
    } else {
      update({ symptoms: [...data.symptoms, sym] });
    }
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...data,
      age: parseInt(data.age, 10),
      days_prescribed: data.days_prescribed ? parseInt(data.days_prescribed, 10) : null,
      days_completed: data.days_completed ? parseInt(data.days_completed, 10) : null,
    });
  };

  const isValidStep1 = data.age > 0 && data.symptoms.length > 0;
  const isValidStep2 = !data.doctor_consulted || (data.doctor_consulted && data.antibiotic_prescribed !== '');
  const isValidStep3 = true; // days can be optional or default
  
  const stepLabels = ["Personal Info", "Medical Consultation", "Treatment Compliance", "History"];

  return (
    <div className="glass-card max-w-2xl mx-auto p-6 md:p-8 animate-fade-in relative overflow-hidden">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
          <span>Step {step} of 4: {stepLabels[step - 1]}</span>
          <span>{Math.round((step / 4) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (step === 4) handleSubmit(e); else handleNext(); }} className="min-h-[300px] flex flex-col justify-between relative">
        <div className="flex-grow">
          {step === 1 && (
            <div className="animate-slide-right">
              <h2 className="text-2xl font-semibold mb-6">Tell us about your current situation</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Age</label>
                <input 
                  type="number" 
                  min="1" max="120"
                  value={data.age}
                  onChange={e => update({ age: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400"
                  placeholder="Enter your age"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Symptoms (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map(sym => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`chip ${data.symptoms.includes(sym) ? 'selected' : ''}`}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-right">
              <h2 className="text-2xl font-semibold mb-6">Medical Consultation</h2>
              
              <div className="mb-6">
                <label className="flex items-center gap-3 p-4 glass-card-light cursor-pointer rounded-lg hover:border-teal-400/50 transition-colors">
                  <input 
                    type="checkbox"
                    checked={data.doctor_consulted}
                    onChange={e => update({ doctor_consulted: e.target.checked, antibiotic_prescribed: '' })}
                    className="w-5 h-5 accent-teal-500 rounded border-slate-600"
                  />
                  <span className="font-medium">I have consulted a doctor for this illness</span>
                </label>
              </div>

              {data.doctor_consulted && (
                <div className="animate-slide-up">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Which antibiotic was prescribed?</label>
                  <select 
                    value={data.antibiotic_prescribed}
                    onChange={e => update({ antibiotic_prescribed: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-teal-400"
                  >
                    <option value="" disabled>Select an option</option>
                    {ANTIBIOTICS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="animate-slide-right">
              <h2 className="text-2xl font-semibold mb-6">Treatment Compliance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Days Prescribed</label>
                  <input 
                    type="number" min="0"
                    value={data.days_prescribed}
                    onChange={e => update({ days_prescribed: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-teal-400"
                    placeholder="e.g. 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Days Completed</label>
                  <input 
                    type="number" min="0"
                    value={data.days_completed}
                    onChange={e => update({ days_completed: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-teal-400"
                    placeholder="e.g. 3"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 p-4 glass-card-light cursor-pointer rounded-lg hover:border-amber-400/50 transition-colors">
                  <input 
                    type="checkbox"
                    checked={data.doses_skipped}
                    onChange={e => update({ doses_skipped: e.target.checked })}
                    className="w-5 h-5 accent-amber-500 rounded border-slate-600"
                  />
                  <span className="font-medium">I have skipped one or more doses</span>
                </label>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-slide-right">
              <h2 className="text-2xl font-semibold mb-6">History & Practices</h2>
              
              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 glass-card-light cursor-pointer rounded-lg hover:border-coral-400/50 transition-colors">
                  <input 
                    type="checkbox"
                    checked={data.self_medicated}
                    onChange={e => update({ self_medicated: e.target.checked })}
                    className="w-5 h-5 mt-0.5 accent-coral-500 rounded border-slate-600"
                  />
                  <div>
                    <span className="block font-medium mb-1">Self-Medication</span>
                    <span className="text-sm text-slate-400">Have you used antibiotics without a prescription or used leftover medicine for this illness?</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 glass-card-light cursor-pointer rounded-lg hover:border-amber-400/50 transition-colors">
                  <input 
                    type="checkbox"
                    checked={data.prior_use_6mo}
                    onChange={e => update({ prior_use_6mo: e.target.checked })}
                    className="w-5 h-5 mt-0.5 accent-amber-500 rounded border-slate-600"
                  />
                  <div>
                    <span className="block font-medium mb-1">Prior Use</span>
                    <span className="text-sm text-slate-400">Have you taken any antibiotics in the last 6 months?</span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between pt-4 border-t border-slate-700/50">
          {step > 1 ? (
            <button type="button" onClick={handleBack} className="btn-secondary">
              Back
            </button>
          ) : <div></div>}
          
          {step < 4 ? (
            <button 
              type="button" 
              onClick={handleNext} 
              disabled={(step === 1 && !isValidStep1) || (step === 2 && !isValidStep2)}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary relative"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : "Calculate Risk"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
