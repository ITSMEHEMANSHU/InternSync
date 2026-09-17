import { useState } from 'react';

const AIInsightCard = ({ title, insight, why, score }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-space-md rounded-xl bg-gradient-to-br from-primary-fixed/30 to-secondary-fixed/20 border border-primary/20 shadow-sm flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary text-on-primary">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          </div>
          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">{title}</span>
        </div>
        {score && <span className="font-numeric-metric text-[20px] text-primary font-bold">{score}</span>}
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{insight}</p>
      {why && (
        <>
          <button onClick={() => setExpanded((e) => !e)} className="flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline w-fit">
            <span className="material-symbols-outlined text-[14px]">{expanded ? 'expand_less' : 'expand_more'}</span>
            Why this match?
          </button>
          {expanded && <p className="font-body-xs text-body-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/30 pt-2">{why}</p>}
        </>
      )}
    </div>
  );
};

export default AIInsightCard;
