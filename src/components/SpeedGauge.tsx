import React from 'react';
import { motion } from 'motion/react';
import { formatTime } from '../utils/formatTime';

interface SpeedGaugeProps {
  currentSpeed: number;
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
}

export function SpeedGauge({
  currentSpeed,
  label = "페이스",
  unit = "/500m",
  min = 60,
  max = 180
}: SpeedGaugeProps) {
  const clampedSpeed = Math.max(min, Math.min(max, currentSpeed));
  const percentage = ((clampedSpeed - min) / (max - min));
  const angle = -135 + (percentage * 270);

  const getSpeedColor = (speed: number) => {
    if (speed < 90) return '#22FF88';
    if (speed < 120) return '#00B8FF';
    if (speed < 150) return '#FFB800';
    return '#FF4444';
  };

  const speedColor = getSpeedColor(clampedSpeed);

  return (
    <div className="relative w-44 h-44">
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {/* Background arc */}
        <path
          d="M 23.58 141.42 A 80 80 0 1 1 176.42 141.42"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Active arc */}
        <motion.path
          d="M 23.58 141.42 A 80 80 0 1 1 176.42 141.42"
          fill="none"
          stroke={speedColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="377"
          initial={{ strokeDashoffset: 377 }}
          animate={{ strokeDashoffset: 377 - (percentage * 377) }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Glow effect */}
        <motion.path
          d="M 23.58 141.42 A 80 80 0 1 1 176.42 141.42"
          fill="none"
          stroke={speedColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="377"
          initial={{ strokeDashoffset: 377 }}
          animate={{ strokeDashoffset: 377 - (percentage * 377) }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ filter: 'blur(6px)', opacity: 0.3 }}
        />

        {/* Tick marks */}
        {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
          const tickAngle = -135 + (tick * 270);
          const tickRad = (tickAngle * Math.PI) / 180;
          const x1 = 100 + Math.cos(tickRad) * 75;
          const y1 = 100 + Math.sin(tickRad) * 75;
          const x2 = 100 + Math.cos(tickRad) * 83;
          const y2 = 100 + Math.sin(tickRad) * 83;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          );
        })}
      </svg>

      {/* Needle */}
      <motion.div
        className="absolute top-1/2 left-1/2 origin-bottom"
        style={{ width: '2px', height: '58px', marginLeft: '-1px', marginTop: '-58px' }}
        initial={{ rotate: -135 }}
        animate={{ rotate: angle }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="w-full h-full bg-gradient-to-t from-white to-white/50 rounded-full" />
      </motion.div>

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 bg-white rounded-full shadow-lg" />

      {/* Value display */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-5">
        <div
          className="text-2xl font-bold tabular-nums"
          style={{ color: speedColor, textShadow: `0 0 16px ${speedColor}40` }}
        >
          {formatTime(clampedSpeed)}
        </div>
        <div className="text-white/40 text-[10px] mt-0.5">{unit}</div>
      </div>

      {/* Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-[10px] uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
