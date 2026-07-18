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
  const totalSteps = 6;
  const [data, setData] = useState({
    age: '',
    symptoms: [],
    doctor_consulted: null,       // null = unanswered, true/false = answered
    antibiotic_prescribed: '',
    self_medicated: null,
    days_prescribed: '',
    days_completed: '',
    doses_skipped: null,
    prior_use_6mo: null,
    shared_antibiotics: null      // new question
  });

  const update = (fields) => setData(prev => ({ ...prev, ...fields }));

  const toggleSymptom = (sym) => {
    if (data.symptoms.includes(sym)) {
      update({ symptoms: data.symptoms.filter(s => s !== sym) });
    } else {
      update({ symptoms: [...data.symptoms, sym] });
    }
  };

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...data,
      age: parseInt(data.age, 10),
      doctor_consulted: data.doctor_consulted === true,
      self_medicated: data.self_medicated === true,
      doses_skipped: data.doses_skipped === true,
      prior_use_6mo: data.prior_use_6mo === true,
      shared_antibiotics: data.shared_antibiotics === true,
      days_prescribed: data.days_prescribed ? parseInt(data.days_prescribed, 10) : null,
      days_completed: data.days_completed ? parseInt(data.days_completed, 10) : null,
    });
  };

  const isValidStep1 = data.age > 0 && data.symptoms.length > 0;
  const isValidStep2 = data.doctor_consulted !== null;
  const isValidStep3 = data.self_medicated !== null;
  const isValidStep4 = true; // days are optional
  const isValidStep5 = data.doses_skipped !== null;
  
  const stepLabels = [
    "Your Symptoms", 
    "Doctor Consultation", 
    "Self-Medication", 
    "Course Completion", 
    "Dose Adherence",
    "History"
  ];

  const YesNoCard = ({ label, description, value, onChange, yesColor = "teal", noColor = "slate" }) => (
    <div className="space-y-3">
      <p className="font-medium text-lg text-white mb-1">{label}</p>
      {description && <p className="text-sm text-slate-400 mb-3">{description}</p>}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${
            value === true 
              ? `border-${yesColor}-400 bg-${yesColor}-500/20 text-${yesColor}-300 shadow-[0_0_15px_rgba(45,212,191,0.2)]` 
              : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500'
          }`}
        >
          ✓ Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200 ${
            value === false 
              ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
              : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500'
          }`}
        >
          ✗ No
        </button>
      </div>
    </div>
  );

  return (
    <div className="glass-card max-w-2xl mx-auto p-6 md:p-8 animate-fade-in relative overflow-hidden">
      {/* Question counter */}
      <div className="mb-2 text-center">
        <span className="text-xs uppercase tracking-widest text-teal-400 font-semibold">Question {step} of {totalSteps}</span>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
          <span>{stepLabels[step - 1]}</span>
          <span>{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); if (step === totalSteps) handleSubmit(e); else handleNext(); }} className="min-h-[320px] flex flex-col justify-between relative">
        <div className="flex-grow">

          {/* Q1: Age + Symptoms */}
          {step === 1 && (
            <div className="animate-slide-right">
              <h2 className="text-2xl font-semibold mb-6">What symptoms are you experiencing?</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Age</label>
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

          {/* Q2: Doctor Consulted? */}
          {step === 2 && (
            <div className="animate-slide-right">
              <h2 className="text-2xl font-semibold mb-6">Did you consult a doctor?</h2>
              
              <YesNoCard
                label="Have you consulted a doctor before taking any antibiotic for this illness?"
                description="Using antibiotics without medical guidance is a major driver of antimicrobial resistance."
                value={data.doctor_consulted}
                onChange={(v) => update({ doctor_consulted: v, antibiotic_prescribed: '' })}
              />

              {data.doctor_consulted === true && (
                <div className="animate-slide-up mt-6">
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

          {/* Q3: Self-Medication / Leftover use */}
          {step === 3 && (
            <div className="animate-slide-right">
              <h2 className="text-2xl font-semibold mb-6">Self-Medication Check</h2>
              
              <YesNoCard
                label="Did you take antibiotics without a prescription, or use leftover antibiotics from an older illness?"
                description="Self-medication with antibiotics—especially leftover ones—often means the wrong drug, wrong dose, or expired medicine, all of which accelerate resistance."
                value={data.self_medicated}
                onChange={(v) => update({ self_medicated: v })}
              />
            </div>
          )}

          {/* Q4: Course Completion */}
          {step === 4 && (
            <div className="animate-slide-right">
              <h2 className="text-2xl font-semibold mb-6">Did you complete the full course?</h2>
              <p className="text-sm text-slate-400 mb-6">Stopping antibiotics early—even if you feel better—allows partially resistant bacteria to survive and multiply.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Days Prescribed by Doctor</label>
                  <input 
                    type="number" min="0"
                    value={data.days_prescribed}
                    onChange={e => update({ days_prescribed: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-teal-400"
                    placeholder="e.g. 7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Days You Actually Completed</label>
                  <input 
                    type="number" min="0"
                    value={data.days_completed}
                    onChange={e => update({ days_completed: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-teal-400"
                    placeholder="e.g. 3"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">Leave blank if you don't remember or were not prescribed a specific course.</p>
            </div>
          )}

          {/* Q5: Doses Skipped */}
          {step === 5 && (
            <div className="animate-slide-right">
              <h2 className="text-2xl font-semibold mb-6">Did you skip any doses?</h2>
              
              <YesNoCard
                label="Have you missed or skipped one or more doses during your antibiotic course?"
                description="Skipping doses creates sub-therapeutic drug levels in your body, giving bacteria the perfect window to develop resistance mechanisms."
                value={data.doses_skipped}
                onChange={(v) => update({ doses_skipped: v })}
              />
            </div>
          )}

          {/* Q6: History — Prior use + Sharing */}
          {step === 6 && (
            <div className="animate-slide-right">
              <h2 className="text-2xl font-semibold mb-6">Antibiotic History</h2>
              
              <div className="space-y-6">
                <YesNoCard
                  label="Have you taken antibiotics in the last 6 months (for a different illness)?"
                  description="Frequent antibiotic use within short periods increases selective pressure on bacteria."
                  value={data.prior_use_6mo}
                  onChange={(v) => update({ prior_use_6mo: v })}
                />

                <div className="border-t border-slate-700/50 pt-6">
                  <YesNoCard
                    label="Have you ever shared your antibiotics with a family member or friend?"
                    description="Sharing antibiotics means the wrong drug for the wrong person—a dangerous practice that fuels AMR."
                    value={data.shared_antibiotics}
                    onChange={(v) => update({ shared_antibiotics: v })}
                  />
                </div>
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
          
          {step < totalSteps ? (
            <button 
              type="button" 
              onClick={handleNext} 
              disabled={
                (step === 1 && !isValidStep1) || 
                (step === 2 && !isValidStep2) ||
                (step === 3 && !isValidStep3)
              }
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Question →
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
              ) : "🔬 Calculate My Risk"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
