import React, { useState, useEffect } from 'react';

export const RealTimeClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  return (
    <div className="p-2 bg-slate-900/50 rounded-md border border-slate-700/50 text-center">
      <p className="text-xs text-slate-400 font-mono tracking-wider" aria-live="polite">
        {formatTime(time)}
      </p>
    </div>
  );
};