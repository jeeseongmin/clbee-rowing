import React from 'react';

interface SpeedDialProps {
  timePerDistance: number;
}

export function SpeedDial({ timePerDistance }: SpeedDialProps) {
  const minTime = 90;
  const maxTime = 240;
  const clampedTime = Math.max(minTime, Math.min(maxTime, timePerDistance));
  const angle = ((clampedTime - minTime) / (maxTime - minTime)) * 270 - 135;

  const minutes = Math.floor(timePerDistance / 60);
  const seconds = Math.floor(timePerDistance % 60);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 flex flex-col items-center justify-center">
      <div className="mb-2">
        <span className="text-white/60">Time/500m</span>
      </div>
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="url(#dialGradient)"
            strokeWidth="8"
            strokeDasharray="330"
            strokeDashoffset="0"
            strokeLinecap="round"
            transform="rotate(-135 80 80)"
          />
          <defs>
            <linearGradient id="dialGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22FF88" />
              <stop offset="100%" stopColor="#00B8FF" />
            </linearGradient>
          </defs>
          <line
            x1="80"
            y1="80"
            x2="80"
            y2="20"
            stroke="#00B8FF"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${angle} 80 80)`}
            style={{ transition: 'transform 0.3s ease' }}
          />
          <circle cx="80" cy="80" r="6" fill="#00B8FF" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl text-white">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
