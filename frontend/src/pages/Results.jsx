import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RiskResult from '../components/RiskResult/RiskResult';
import Explanation from '../components/Explanation/Explanation';
import Disclaimer from '../components/Disclaimer/Disclaimer';
import { getGuideline, getExplanation } from '../utils/api';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [assessData] = useState(state?.assessData || null);
  const [explainData, setExplainData] = useState(null);
  const [loadingExplain, setLoadingExplain] = useState(false);

  useEffect(() => {
    if (!assessData) {
      navigate('/assessment', { replace: true });
      return;
    }
    
    if (!explainData && !loadingExplain) {
      const fetchExplain = async () => {
        setLoadingExplain(true);
        try {
          const snippetsMap = {};
          if (assessData.reasons && assessData.reasons.length > 0) {
            const guidelinePromises = assessData.reasons
              .filter(r => r.guideline_ref)
              .map(async (r) => {
                try {
                  const g = await getGuideline(r.guideline_ref);
                  return { ref: r.guideline_ref, snippet: g.snippet };
                } catch {
                  return { ref: r.guideline_ref, snippet: '' };
                }
              });
            
            const guidelines = await Promise.all(guidelinePromises);
            guidelines.forEach(g => {
              if (g.snippet) {
                snippetsMap[g.ref] = g.snippet;
              }
            });
          }

          const payload = {
            score: assessData.score,
            category: assessData.category,
            reasons: assessData.reasons.map(r => ({
              rule_id: r.rule_id,
              description: r.description,
              weight: r.weight,
              guideline_ref: r.guideline_ref
            })),
            snippets: snippetsMap
          };
          const data = await getExplanation(payload);
          setExplainData(data);
        } catch (err) {
          console.error("Failed to load explanation", err);
        } finally {
          setLoadingExplain(false);
        }
      };
      fetchExplain();
    }
  }, [assessData, explainData, navigate, loadingExplain]);

  if (!assessData) return null;

  const isHigh = assessData.category === "High";

  return (
    <div className="flex-grow w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-xl md:py-3xl flex flex-col gap-lg animate-fade-in">
      <header className="flex flex-col gap-md mb-md">
        <div>
          <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-primary">Assessment Results</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-xs">Analysis ID: #{assessData.session_id.split('-')[0].toUpperCase()} | Generated just now</p>
        </div>
        
        {isHigh && (
          <div className="bg-error-container border border-error rounded-lg p-md flex items-start gap-md mt-sm shadow-sm">
            <span className="material-symbols-outlined text-error mt-xs" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
            <div>
              <h3 className="text-headline-sm font-headline-sm text-on-error-container">High Risk Profile Identified</h3>
              <p className="text-body-sm font-body-sm text-on-error-container mt-xs">Patient demonstrates significant behavioral and historical markers indicating elevated risk for developing or harboring antimicrobial-resistant infections. Immediate clinical review recommended prior to prescribing broad-spectrum antibiotics.</p>
            </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Gauge & Analysis (Wider) */}
        <div className="lg:col-span-7 flex flex-col gap-gutter">
          <RiskResult data={assessData} variant="gaugeOnly" />
          <Explanation explanation={explainData} loading={!explainData && loadingExplain} />
        </div>

        {/* Right Column: Risk Factors List (Narrower) */}
        <div className="lg:col-span-5 flex flex-col">
          <RiskResult data={assessData} variant="factorsOnly" />
        </div>
      </div>
      
      {/* Disclaimer Banner below main grid */}
      <Disclaimer riskCategory={assessData.category} />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-md mt-lg border-t border-outline-variant pt-lg">
        <button 
          onClick={() => navigate('/assessment')}
          className="w-full sm:w-auto px-lg py-sm rounded border border-secondary text-secondary font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-xs cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>refresh</span>
          Restart Assessment
        </button>
        <button 
          onClick={() => navigate('/learn')}
          className="w-full sm:w-auto px-lg py-sm rounded bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary transition-colors flex items-center justify-center gap-xs cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>school</span>
          Learn About AMR
        </button>
      </div>
    </div>
  );
}
