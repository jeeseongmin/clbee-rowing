import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface RouteTrackerProps {
  totalDistance: number;
  targetDistance?: number;
}

export function RouteTracker({ totalDistance, targetDistance }: RouteTrackerProps) {
  const maxDistance = targetDistance || Math.max(totalDistance * 1.5, 2000);
  const progress = Math.min((totalDistance / maxDistance) * 100, 100);

  const pathPoints = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const segments = 50;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = 20 + t * 160;
      const y = 70 + Math.sin(t * Math.PI * 2.5) * 25 + Math.cos(t * Math.PI * 1.5) * 15;
      points.push({ x, y });
    }
    return points;
  }, []);

  const pathString = useMemo(() => {
    return pathPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [pathPoints]);

  const currentPosition = useMemo(() => {
    const index = Math.floor((progress / 100) * (pathPoints.length - 1));
    return pathPoints[index] || pathPoints[0];
  }, [progress, pathPoints]);

  const pathLength = 300;
  const completedLength = (progress / 100) * pathLength;

  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10">
      <div className="relative w-52 h-36">
        <svg viewBox="0 0 200 140" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(34, 197, 94, 0.08)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22FF88" />
              <stop offset="50%" stopColor="#00B8FF" />
              <stop offset="100%" stopColor="#22FF88" />
            </linearGradient>
          </defs>

          <rect width="200" height="140" fill="url(#mapGrid)" />

          {/* Incomplete path */}
          <path d={pathString} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

          {/* Completed path */}
          <path
            d={pathString} fill="none" stroke="url(#routeGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={pathLength} strokeDashoffset={pathLength - completedLength}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
          {/* Glow */}
          <path
            d={pathString} fill="none" stroke="#22FF88" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={pathLength} strokeDashoffset={pathLength - completedLength}
            style={{ transition: 'stroke-dashoffset 0.5s ease', filter: 'blur(4px)', opacity: 0.3 }}
          />

          {/* Start marker */}
          <circle cx={pathPoints[0].x} cy={pathPoints[0].y} r="3" fill="#00B8FF" />

          {/* End flag */}
          <g transform={`translate(${pathPoints[pathPoints.length - 1].x - 4}, ${pathPoints[pathPoints.length - 1].y - 10})`}>
            <path d="M 0 0 L 0 12 M 0 1 L 6 1 L 6 5 L 0 5" stroke="#22FF88" strokeWidth="1.5" fill="#22FF88" fillOpacity="0.5" />
          </g>

          {/* Current position pulse */}
          <motion.circle
            cx={currentPosition.x} cy={currentPosition.y} r="8" fill="#22FF88"
            animate={{ opacity: [0.5, 0.15, 0.5], scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <circle cx={currentPosition.x} cy={currentPosition.y} r="4" fill="#22FF88" stroke="white" strokeWidth="1.5" />
        </svg>

        {/* Distance overlay */}
        <div className="absolute top-2 left-2 text-[10px] tabular-nums" style={{ color: '#22FF88' }}>
          {(totalDistance / 1000).toFixed(2)} km
        </div>
        <div className="absolute bottom-2 right-2 text-[10px] tabular-nums text-white/50">
          {progress.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
