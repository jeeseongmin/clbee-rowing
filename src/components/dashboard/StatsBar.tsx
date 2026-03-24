import React from 'react';
import { Racer } from './types';
import { RACE_DIST, MY_ID } from './constants';

interface StatsBarProps {
  racers: Racer[];
  elapsed: number;
}

function fmt(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function StatsBar({ racers, elapsed }: StatsBarProps) {
  const me = racers.find((r) => r.id === MY_ID);
  const remaining = Math.max(0, Math.round(RACE_DIST - (me?.progress || 0)));

  const stats = [
    { icon: '👥', label: '참여자', value: `${racers.length}명`, highlight: false },
    { icon: '📊', label: '내 순위', value: `${me?.rank || '-'}위`, highlight: true },
    { icon: '⏱', label: '경과', value: fmt(elapsed), highlight: false },
    { icon: '🏁', label: '내 남은거리', value: `${remaining}m`, highlight: true },
  ];

  return (
    <div className="db-stats">
      {stats.map((s, i) => (
        <div
          key={i}
          className={`db-stat ${s.highlight ? 'db-stat-hl' : ''}`}
        >
          <div className="db-stat-icon">{s.icon}</div>
          <div className="db-stat-val">{s.value}</div>
          <div className="db-stat-lbl">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
