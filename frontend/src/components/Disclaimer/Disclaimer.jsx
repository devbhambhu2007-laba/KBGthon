import React from 'react';

const STATIC_TEXT = "This application is not a diagnostic tool. It cannot identify bacterial infection or prescribe treatment. Always consult a registered medical practitioner.";

const DYNAMIC_MESSAGES = {
  High: {
    icon: "warning",
    containerClass: "bg-[#fff8f6] border border-[#ffb4ab]",
    iconClass: "text-[#ba1a1a]",
    textClass: "text-[#93000a]",
    text: "Your risk level is HIGH. We strongly recommend you consult a registered medical practitioner as soon as possible to review your antibiotic usage patterns.",
    action: "⚕️ Please schedule a doctor's appointment at the earliest."
  },
  Medium: {
    icon: "report_problem",
    containerClass: "bg-[#fff9e6] border border-[#ffdf99]",
    iconClass: "text-[#b37a00]",
    textClass: "text-[#805600]",
    text: "Your risk level is MODERATE. Some of your antibiotic usage habits may contribute to antimicrobial resistance. Consider consulting a healthcare professional.",
    action: "💡 Discuss your antibiotic habits with a doctor at your next visit."
  },
  Low: {
    icon: "verified_user",
    containerClass: "bg-[#f2fcf6] border border-[#85f8c4]",
    iconClass: "text-[#005137]",
    textClass: "text-[#00301f]",
    text: "Your risk level is LOW. Your reported antibiotic usage habits appear to be within safe practices. Keep it up!",
    action: "👍 Continue following your doctor's guidance for any future antibiotic use."
  }
};

export default function Disclaimer({ variant = 'inline', riskCategory = null }) {
  if (riskCategory && DYNAMIC_MESSAGES[riskCategory]) {
    const msg = DYNAMIC_MESSAGES[riskCategory];
    return (
      <div className={`p-md rounded flex gap-sm items-start shadow-sm mt-xl ${msg.containerClass}`}>
        <span className={`material-symbols-outlined shrink-0 ${msg.iconClass}`}>{msg.icon}</span>
        <div className="flex flex-col gap-1">
          <p className={`font-body-sm text-body-sm font-bold ${msg.textClass}`}>{msg.text}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant italic">{msg.action}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70 mt-2 border-t border-outline-variant/30 pt-2">{STATIC_TEXT}</p>
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="fixed bottom-0 left-0 w-full p-sm z-50 bg-surface-container-low border-t border-outline-variant text-center font-label-sm text-label-sm">
        <p className="max-w-[1440px] mx-auto flex items-center justify-center gap-xs text-on-surface-variant">
          <span className="material-symbols-outlined text-[16px]">info</span>
          {STATIC_TEXT}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low border border-outline-variant p-sm rounded flex gap-sm items-start text-on-surface-variant font-body-sm text-body-sm my-md">
      <span className="material-symbols-outlined text-[20px] text-primary">info</span>
      <p>{STATIC_TEXT}</p>
    </div>
  );
}
