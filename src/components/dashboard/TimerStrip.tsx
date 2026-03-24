import React from 'react';

interface TimerStripProps {
  elapsed: number;
}

function fmt(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function TimerStrip({ elapsed }: TimerStripProps) {
  return (
    <div className="db-timer">
      <div className="db-timer-rec">
        <span className="db-timer-medal">🥇</span>
        <div>
          <div className="db-timer-txt">김을동 1st : 06:12.12</div>
          <div className="db-timer-sub">현재 최고 기록</div>
        </div>
      </div>
      <div className="db-timer-clock">{fmt(elapsed)}</div>
    </div>
  );
}
