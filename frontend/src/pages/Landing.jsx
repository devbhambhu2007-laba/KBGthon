import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto py-xl md:py-3xl flex flex-col md:flex-row items-center gap-2xl">
        <div className="flex-1 flex flex-col gap-lg items-start">
          <div className="inline-flex items-center gap-sm bg-surface-container border border-outline-variant rounded-full px-sm py-xs">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="text-label-sm font-label-sm text-on-surface-variant">Clinical Decision Support v2.1</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-primary max-w-[672px] leading-tight">
            Understand Your Antibiotic Risk
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[576px]">
            Professional assessment tool grounded in WHO and CDC guidelines. Make evidence-based decisions to combat antimicrobial resistance effectively.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-md pt-sm w-full sm:w-auto">
            <button 
              onClick={() => navigate('/assessment')}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-primary-container text-on-primary px-xl py-md rounded font-label-md text-label-md hover:bg-primary transition-colors cursor-pointer active:scale-95"
            >
              Start Assessment
            </button>
            <button 
              onClick={() => navigate('/learn')}
              className="w-full sm:w-auto inline-flex items-center justify-center border border-secondary text-secondary px-xl py-md rounded font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95"
            >
              View Guidelines
            </button>
          </div>
        </div>
        
        <div className="flex-1 w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-outline-variant shadow-sm relative">
          <img 
            className="w-full h-full object-cover" 
            alt="Medical laboratory setting with digital tablet" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjT8DLSF7fo-7sSDQlggCWFYjZSaJ91T3FNkNs8Kj3ERJ0KuU-63NP_HtfyKcyAy3MXTJUKazd-gAhBfNakcCnzkF1m7higzzPy1Qfway6Ge_hjNRjJTGz1hkaZ1HmQMgJOv2KuCeW2nU3eNmGr7QW5bz9VnoonlYIO9mrKvlL7oHl3mpcZ2Y4nH1cGCXmyjOvRTyXZBv1MyC7WvlludLv5kIB9cw5biZhVV_4SuV5WCoqZTMkeTUZ"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto py-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-sm">
            <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center mb-xs">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>coronavirus</span>
            </div>
            <span className="font-display-lg text-display-lg text-primary">4.95M</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Annual Deaths</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Globally associated with antimicrobial resistance (AMR).</p>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-sm">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-xs">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>prescriptions</span>
            </div>
            <span className="font-display-lg text-display-lg text-primary">30%</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Unnecessary</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Outpatient antibiotic prescriptions are considered inappropriate.</p>
          </div>
          
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-sm">
            <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-xs">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>science</span>
            </div>
            <div className="flex items-baseline gap-xs">
              <span className="font-display-lg text-display-lg text-primary">12</span>
              <span className="font-headline-sm text-headline-sm text-on-surface-variant">vs 60+</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Critical Strains</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Priority pathogens tracked compared to overall identified threats.</p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="w-full bg-surface-container-low border-t border-b border-outline-variant py-3xl">
        <div className="px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto flex flex-col gap-2xl">
          <div className="text-center max-w-[672px] mx-auto">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">Structured Assessment Protocol</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              A streamlined, three-step methodology to evaluate risk factors and determine the appropriate clinical pathway.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px bg-outline-variant z-0"></div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center gap-md relative z-10">
              <div className="w-24 h-24 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-primary text-[40px]">assignment</span>
              </div>
              <div className="flex flex-col gap-xs">
                <h4 className="font-headline-md text-headline-md text-primary">Answer</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[320px] mx-auto">
                  Input patient history and symptoms into our structured clinical questionnaire.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center gap-md relative z-10">
              <div className="w-24 h-24 rounded-full bg-surface-container-lowest border-2 border-outline-variant flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-on-surface-variant text-[40px]">analytics</span>
              </div>
              <div className="flex flex-col gap-xs">
                <h4 className="font-headline-md text-headline-md text-primary">Analyze</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[320px] mx-auto">
                  Our algorithm cross-references data against current WHO/CDC guidelines.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center gap-md relative z-10">
              <div className="w-24 h-24 rounded-full bg-surface-container-lowest border-2 border-outline-variant flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-on-surface-variant text-[40px]">school</span>
              </div>
              <div className="flex flex-col gap-xs">
                <h4 className="font-headline-md text-headline-md text-primary">Explain</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[320px] mx-auto">
                  Receive clear, actionable recommendations and patient education materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
