import React from 'react';
import { Racer } from './types';
import { MY_ID } from './constants';

interface FinishOverlayProps {
  visible: boolean;
  winner: Racer | null;
  racers: Racer[];
  onReset: () => void;
}

export function FinishOverlay({ visible, winner, racers, onReset }: FinishOverlayProps) {
  if (!visible) return null;

  const me = racers.find((r) => r.id === MY_ID);

  return (
    <div className="db-overlay">
      <div className="db-fin-card">
        <div className="db-fin-flag">🏁</div>
        <h2>RACE FINISHED</h2>
        <p className="db-fin-winner">
          🥇 {winner?.name} — 1st Place
        </p>
        <p className="db-fin-my">
          내 결과: <strong>{me?.rank}위</strong>
        </p>
        <button className="db-fin-btn" onClick={onReset}>
          다시 시작
        </button>
      </div>
    </div>
  );
}
