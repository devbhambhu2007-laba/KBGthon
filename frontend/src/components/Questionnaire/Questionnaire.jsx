import React, { useState, useMemo } from 'react';

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

const YesNoCard = ({ label, description, value, onChange }) => (
  <div className="flex flex-col gap-md w-full">
    <h1 className="text-headline-sm md:text-headline-md font-headline-sm md:font-headline-md text-on-surface">{label}</h1>
    {description && (
      <div className="bg-surface-container-low p-md rounded flex gap-md items-start border border-outline-variant/50">
        <span className="material-symbols-outlined text-on-surface-variant mt-0.5">info</span>
        <p className="text-body-sm font-body-sm text-on-surface-variant">{description}</p>
      </div>
    )}
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-sm">
      <label className="cursor-pointer relative group">
        <input 
          className="peer sr-only" 
          name="yesno" 
          type="radio" 
          checked={value === true}
          onChange={() => onChange(true)}
        />
        <div className="w-full h-full p-md md:p-lg border border-outline-variant rounded bg-surface-container-lowest flex flex-col items-center justify-center gap-sm transition-all duration-200 peer-checked:border-primary peer-checked:border-2 peer-checked:bg-surface-container-low hover:border-outline peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 min-h-[140px]">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-on-surface peer-checked:text-primary transition-colors">check_circle</span>
          <span className="text-label-md font-label-md text-on-surface-variant group-hover:text-on-surface peer-checked:text-primary peer-checked:font-bold transition-all">Yes</span>
        </div>
      </label>
      
      <label className="cursor-pointer relative group">
        <input 
          className="peer sr-only" 
          name="yesno" 
          type="radio" 
          checked={value === false}
          onChange={() => onChange(false)}
        />
        <div className="w-full h-full p-md md:p-lg border border-outline-variant rounded bg-surface-container-lowest flex flex-col items-center justify-center gap-sm transition-all duration-200 peer-checked:border-primary peer-checked:border-2 peer-checked:bg-surface-container-low hover:border-outline peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 min-h-[140px]">
          <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-on-surface peer-checked:text-primary transition-colors">cancel</span>
          <span className="text-label-md font-label-md text-on-surface-variant group-hover:text-on-surface peer-checked:text-primary peer-checked:font-bold transition-all">No</span>
        </div>
      </label>
    </div>
  </div>
);

export default function Questionnaire({ onSubmit, loading }) {
  const [data, setData] = useState({
    age: '',
    symptoms: [],
    doctor_consulted: null,
    antibiotic_prescribed: '',
    self_medicated: null,
    days_prescribed: '',
    days_completed: '',
    doses_skipped: null,
    prior_use_6mo: null,
    shared_antibiotics: null,
  });

  const update = (fields) => setData(prev => ({ ...prev, ...fields }));

  const toggleSymptom = (sym) => {
    if (data.symptoms.includes(sym)) {
      update({ symptoms: data.symptoms.filter(s => s !== sym) });
    } else {
      update({ symptoms: [...data.symptoms, sym] });
    }
  };

  const steps = useMemo(() => {
    const s = [];
    s.push({ id: 'symptoms', label: 'Patient Symptoms' });
    s.push({ id: 'doctor', label: 'Clinical Consultation' });

    if (data.doctor_consulted === false) {
      s.push({ id: 'self_med', label: 'Self-Medication History' });
    }

    const tookAntibiotics = data.doctor_consulted === true || data.self_medicated === true;
    if (tookAntibiotics) {
      s.push({ id: 'course', label: 'Treatment Course' });
      s.push({ id: 'doses', label: 'Dose Adherence' });
    }

    s.push({ id: 'history', label: 'Prior Usage History' });
    return s;
  }, [data.doctor_consulted, data.self_medicated]);

  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = steps[stepIdx] || steps[0];
  const totalSteps = steps.length;
  const isLastStep = stepIdx === totalSteps - 1;

  const handleNext = () => {
    if (stepIdx < totalSteps - 1) {
      setStepIdx(i => i + 1);
    }
  };
  const handleBack = () => {
    if (stepIdx > 0) {
      setStepIdx(i => i - 1);
    }
  };

  const handleSubmit = () => {
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

  const canProceed = () => {
    switch (currentStep.id) {
      case 'symptoms': return data.age > 0 && data.symptoms.length > 0;
      case 'doctor': return data.doctor_consulted !== null;
      case 'self_med': return data.self_medicated !== null;
      case 'course': return true;
      case 'doses': return data.doses_skipped !== null;
      case 'history': return data.prior_use_6mo !== null && data.shared_antibiotics !== null;
      default: return true;
    }
  };

  const getSkipNote = () => {
    if (currentStep.id === 'history' && data.doctor_consulted === true && data.self_medicated !== true) {
      return "✅ Consultation verified. Bypassing self-medication checks.";
    }
    if (currentStep.id === 'course' && data.doctor_consulted === true) {
      return "📋 Prescription verified. Assessing course completion.";
    }
    if (currentStep.id === 'self_med') {
      return "⚠️ No consultation recorded. Assessing unprescribed usage.";
    }
    return null;
  };

  const skipNote = getSkipNote();

  return (
    <div className="flex-grow flex items-center justify-center py-xl w-full">
      <div className="w-full max-w-[672px] bg-surface-container-lowest border border-outline-variant rounded shadow-sm p-lg md:p-xl flex flex-col gap-xl relative overflow-hidden">
        
        {/* Progress Indicator */}
        <div className="flex flex-col gap-sm">
          <div className="flex justify-between items-center text-label-sm font-label-sm text-on-surface-variant">
            <span>Step {stepIdx + 1} of {totalSteps} {totalSteps < 6 && "(Adaptive)"}</span>
            <span>{currentStep.label}</span>
          </div>
          <div className="h-1 bg-surface-container-high rounded-full w-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300" 
              style={{ width: `${((stepIdx + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Adaptive Context Note */}
        {skipNote && (
          <div className="bg-surface-container-low p-sm rounded flex gap-sm items-center border border-outline-variant/50">
            <span className="material-symbols-outlined text-on-surface-variant text-sm">info</span>
            <p className="text-body-sm font-body-sm text-on-surface-variant">{skipNote}</p>
          </div>
        )}

        {/* Dynamic Content */}
        <div className="min-h-[320px] flex flex-col animate-fade-in">
          <div className="flex-grow" key={currentStep.id}>
            
            {/* SYMPTOMS */}
            {currentStep.id === 'symptoms' && (
              <div className="flex flex-col gap-md">
                <h1 className="text-headline-sm md:text-headline-md font-headline-sm md:font-headline-md text-on-surface">Initial Assessment</h1>
                
                <div className="mt-2">
                  <label className="block text-label-md font-label-md text-on-surface mb-xs">Patient Age</label>
                  <input 
                    type="number" min="1" max="120"
                    value={data.age}
                    onChange={e => update({ age: e.target.value })}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-body-md font-body-md"
                    placeholder="Enter age"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-label-md font-label-md text-on-surface mb-sm">Symptoms (Select all that apply)</label>
                  <div className="flex flex-wrap gap-sm">
                    {SYMPTOMS.map(sym => {
                      const isSelected = data.symptoms.includes(sym);
                      return (
                        <label key={sym} className="cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="peer sr-only" 
                            checked={isSelected}
                            onChange={() => toggleSymptom(sym)}
                          />
                          <div className={`text-label-md font-label-md px-4 py-2 rounded-full border transition-all duration-200 ${
                            isSelected 
                              ? 'bg-primary border-primary text-on-primary' 
                              : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:bg-surface-container-low hover:border-outline'
                          }`}>
                            {sym}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* DOCTOR */}
            {currentStep.id === 'doctor' && (
              <div className="flex flex-col gap-md">
                <YesNoCard
                  label="Was a medical professional consulted prior to antibiotic use?"
                  description="Clinical guidance is essential to distinguish between viral and bacterial etiologies."
                  value={data.doctor_consulted}
                  onChange={(v) => update({ doctor_consulted: v, antibiotic_prescribed: '' })}
                />

                {data.doctor_consulted === true && (
                  <div className="mt-6 animate-fade-in">
                    <label className="block text-label-md font-label-md text-on-surface mb-xs">Prescribed Antibiotic Class/Agent</label>
                    <select 
                      value={data.antibiotic_prescribed}
                      onChange={e => update({ antibiotic_prescribed: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-body-md font-body-md"
                    >
                      <option value="" disabled>Select an option</option>
                      {ANTIBIOTICS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* SELF-MED */}
            {currentStep.id === 'self_med' && (
              <YesNoCard
                label="Did you consume antibiotics without a formal prescription (e.g., leftover medication)?"
                description="Self-medication often results in inappropriate spectrum coverage and sub-therapeutic dosing."
                value={data.self_medicated}
                onChange={(v) => update({ self_medicated: v })}
              />
            )}

            {/* COURSE */}
            {currentStep.id === 'course' && (
              <div className="flex flex-col gap-md">
                <h1 className="text-headline-sm md:text-headline-md font-headline-sm md:font-headline-md text-on-surface">Treatment Course Completion</h1>
                
                <div className="bg-surface-container-low p-md rounded flex gap-md items-start border border-outline-variant/50">
                  <span className="material-symbols-outlined text-on-surface-variant mt-0.5">info</span>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Premature cessation of antimicrobial therapy applies selective pressure, promoting the survival of resistant isolates.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-sm">
                  <div>
                    <label className="block text-label-md font-label-md text-on-surface mb-xs">Days Prescribed</label>
                    <input 
                      type="number" min="0"
                      value={data.days_prescribed}
                      onChange={e => update({ days_prescribed: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-body-md font-body-md"
                      placeholder="e.g. 7"
                    />
                  </div>
                  <div>
                    <label className="block text-label-md font-label-md text-on-surface mb-xs">Days Completed</label>
                    <input 
                      type="number" min="0"
                      value={data.days_completed}
                      onChange={e => update({ days_completed: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded p-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-body-md font-body-md"
                      placeholder="e.g. 3"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DOSES */}
            {currentStep.id === 'doses' && (
              <YesNoCard
                label="Were any prescribed doses skipped or delayed?"
                description="Inconsistent dosing leads to sub-therapeutic plasma concentrations, a key driver of resistance mutation."
                value={data.doses_skipped}
                onChange={(v) => update({ doses_skipped: v })}
              />
            )}

            {/* HISTORY */}
            {currentStep.id === 'history' && (
              <div className="flex flex-col gap-xl">
                <YesNoCard
                  label="Any antimicrobial exposure in the preceding 6 months?"
                  description="Recent exposure significantly alters the microbiome and increases the likelihood of colonization by resistant flora."
                  value={data.prior_use_6mo}
                  onChange={(v) => update({ prior_use_6mo: v })}
                />

                <div className="border-t border-outline-variant pt-md">
                  <YesNoCard
                    label="Have you ever shared antibiotics with others?"
                    description="Distribution of unprescribed antimicrobials facilitates community transmission of resistant phenotypes."
                    value={data.shared_antibiotics}
                    onChange={(v) => update({ shared_antibiotics: v })}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation Actions */}
          <div className="flex justify-between items-center mt-md pt-lg border-t border-outline-variant">
            {stepIdx > 0 ? (
              <button 
                type="button" 
                onClick={handleBack} 
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md group cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                Back
              </button>
            ) : <div></div>}
            
            {!isLastStep ? (
              <button 
                type="button" 
                onClick={handleNext} 
                disabled={!canProceed()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-xl">sync</span>
                    Analyzing...
                  </span>
                ) : (
                  <>
                    Complete
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">check</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
