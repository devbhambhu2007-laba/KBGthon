import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RiskResult from '../components/RiskResult/RiskResult';
import Explanation from '../components/Explanation/Explanation';
import Disclaimer from '../components/Disclaimer/Disclaimer';
import { getExplanation } from '../utils/api';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [assessData] = useState(state?.assessData || null);
  const [explainData, setExplainData] = useState(state?.explainData || null);
  const [loadingExplain, setLoadingExplain] = useState(false);

  useEffect(() => {
    if (!assessData) {
      navigate('/assessment', { replace: true });
      return;
    }
    
    // If we have assessData but no explainData, it means explain wasn't fetched yet
    if (!explainData && !loadingExplain) {
      const fetchExplain = async () => {
        setLoadingExplain(true);
        try {
          // Build snippets map from reasons that have snippets attached
          const snippetsMap = {};
          assessData.reasons.forEach(r => {
            if (r.snippet && r.guideline_ref) {
              snippetsMap[r.guideline_ref] = r.snippet;
            }
          });

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

  return (
    <div className="max-w-4xl mx-auto px-4 w-full py-10 flex-grow animate-fade-in">
      <div className="mb-6">
        <Disclaimer variant="inline" />
      </div>

      <RiskResult data={assessData} />
      
      <Explanation explanation={explainData} loading={!explainData && loadingExplain} />

      <div className="mt-8">
        <Disclaimer variant="inline" />
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
        <button 
          onClick={() => navigate('/assessment')} 
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Take Assessment Again
        </button>
        <button 
          onClick={() => navigate('/learn')} 
          className="btn-primary flex items-center justify-center gap-2"
        >
          Learn More About AMR
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332-.477-4.5-1.253" />
          </svg>
        </button>
      </div>
    </div>
  );
}
