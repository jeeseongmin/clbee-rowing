import React from 'react';
import { RouteTracker } from './RouteTracker';
import { SPMGauge } from './SPMGauge';
import { SpeedGauge } from './SpeedGauge';

interface MetricsPanelProps {
  strokeHistory: number[];
  timePerDistance: number;
  totalDistance: number;
  elapsedTime: number;
  targetStrokeRate?: number;
  targetDistance?: number;
}

export function MetricsPanel({
  strokeHistory,
  timePerDistance,
  totalDistance,
  elapsedTime,
  targetStrokeRate,
  targetDistance,
}: MetricsPanelProps) {
  const currentSPM = strokeHistory[strokeHistory.length - 1] || 0;

  return (
    <>
      {/* Route tracker - top left */}
      <div className="absolute top-24 left-8 z-10">
        <RouteTracker totalDistance={totalDistance} targetDistance={targetDistance} />
      </div>

      {/* Distance display - left center */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10">
        <div className="bg-black/40 backdrop-blur-xl rounded-xl px-6 py-4 border border-white/10">
          <div className="text-white/40 text-[10px] uppercase tracking-wider font-medium mb-1">거리</div>
          <div className="text-4xl font-bold tabular-nums" style={{ color: '#22FF88' }}>
            {totalDistance.toFixed(0)}
          </div>
          <div className="text-white/40 text-xs mt-0.5">미터</div>
        </div>
      </div>

      {/* SPM Gauge - bottom left */}
      <div className="absolute bottom-20 left-8 z-10">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-3 border border-white/10">
          <SPMGauge currentSPM={currentSPM} targetSPM={targetStrokeRate} />
        </div>
      </div>

      {/* Speed Gauge - bottom right */}
      <div className="absolute bottom-20 right-8 z-10">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-3 border border-white/10">
          <SpeedGauge currentSpeed={timePerDistance} />
        </div>
      </div>
    </>
  );
}
