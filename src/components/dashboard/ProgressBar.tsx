import React from 'react';
import { Racer } from './types';
import { RACE_DIST, MY_ID } from './constants';

interface ProgressBarProps {
  racers: Racer[];
}

export function ProgressBar({ racers }: ProgressBarProps) {
  const sorted = [...racers].sort((a, b) => a.rank - b.rank);
  const leader = sorted[0];
  const me = sorted.find((r) => r.id === MY_ID);

  const leaderProgress = Math.round(leader?.progress || 0);
  const myProgress = Math.round(me?.progress || 0);

  return (
    <div className="db-pbar">
      <div className="db-pbar-labels">
        <span>START</span>
        <span>250m</span>
        <span>500m</span>
        <span>750m</span>
        <span>FINISH</span>
      </div>
      <div className="db-pbar-track">
        <div className="db-pbar-marker" style={{ left: '25%' }} />
        <div className="db-pbar-marker" style={{ left: '50%' }} />
        <div className="db-pbar-marker" style={{ left: '75%' }} />
        <div
          className="db-pbar-fill"
          style={{ width: `${(leader?.progress || 0) / 10}%` }}
        />
      </div>
      <div className="db-pbar-info">
        선두{' '}
        <b style={{ color: 'var(--blue)' }}>{leaderProgress}m</b> / 1000m · 내
        위치 <b style={{ color: 'var(--danger)' }}>{myProgress}m</b>
      </div>
    </div>
  );
}
