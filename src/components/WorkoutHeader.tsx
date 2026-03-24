import React from 'react';
import { formatTime } from '../utils/formatTime';

interface WorkoutHeaderProps {
  totalTime: number;
  elapsedTime: number;
  currentSegmentName: string;
  intervalProgress: number;
}

export function WorkoutHeader({
  totalTime,
  elapsedTime,
  currentSegmentName,
  intervalProgress,
}: WorkoutHeaderProps) {
  const remaining = Math.max(0, totalTime - elapsedTime);

  return (
    <div className="absolute top-0 left-0 right-0 px-8 pt-6 z-10">
      <div className="flex items-center justify-between">
        {/* Elapsed time */}
        <div className="bg-black/40 backdrop-blur-xl rounded-xl px-5 py-3 border border-white/10 min-w-[120px]">
          <div className="text-white/50 text-[10px] uppercase tracking-wider font-medium">경과</div>
          <div className="text-white text-3xl font-semibold tabular-nums tracking-tight">
            {formatTime(elapsedTime)}
          </div>
        </div>

        {/* Current segment */}
        <div className="bg-black/40 backdrop-blur-xl rounded-xl px-10 py-3 border border-white/10">
          <div className="text-[10px] text-white/40 uppercase tracking-wider text-center mb-1">구간</div>
          <div
            className="text-center text-2xl font-bold tracking-wide"
            style={{
              color: '#00B8FF',
              textShadow: '0 0 24px rgba(0, 184, 255, 0.5)',
            }}
          >
            {currentSegmentName}
          </div>
        </div>

        {/* Remaining time */}
        <div className="bg-black/40 backdrop-blur-xl rounded-xl px-5 py-3 border border-white/10 min-w-[120px] text-right">
          <div className="text-white/50 text-[10px] uppercase tracking-wider font-medium">남은 시간</div>
          <div className="text-white/80 text-3xl font-semibold tabular-nums tracking-tight">
            {formatTime(remaining)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 relative">
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${intervalProgress}%`,
              background: 'linear-gradient(90deg, #00B8FF, #22FF88)',
              boxShadow: '0 0 12px rgba(0, 184, 255, 0.4)',
            }}
          />
        </div>
        {/* Markers at 25%, 50%, 75% */}
        <div className="absolute top-0 left-1/4 w-px h-1.5 bg-white/15" />
        <div className="absolute top-0 left-1/2 w-px h-1.5 bg-white/15" />
        <div className="absolute top-0 left-3/4 w-px h-1.5 bg-white/15" />
      </div>
    </div>
  );
}
