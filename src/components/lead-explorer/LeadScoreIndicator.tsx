
import React from 'react';

interface LeadScoreIndicatorProps {
  score: number;
}

export const LeadScoreIndicator = ({ score }: LeadScoreIndicatorProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex justify-center items-center">
      <div className="h-2 w-12 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={getScoreColor(score)} 
          style={{ width: `${score}%` }}
          aria-hidden="true"
        />
      </div>
      <span className="ml-2 text-xs">{score}</span>
    </div>
  );
};
