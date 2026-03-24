import React from 'react';
import { motion } from 'motion/react';

interface SPMGaugeProps {
  currentSPM: number;
  targetSPM?: number;
  min?: number;
  max?: number;
}

export function SPMGauge({
  currentSPM,
  targetSPM,
  min = 0,
  max = 40
}: SPMGaugeProps) {
  const clampedSPM = Math.max(min, Math.min(max, currentSPM));
  const percentage = clampedSPM / max;
  const angle = -135 + (percentage * 270);

  const getSPMColor = (spm: number) => {
    if (!targetSPM) {
      if (spm < 15) return '#00B8FF';
      if (spm < 25) return '#22FF88';
      if (spm < 35) return '#FFB800';
      return '#FF4444';
    }
    const diff = Math.abs(spm - targetSPM);
    if (diff < 2) return '#22FF88';
    if (diff < 5) return '#00B8FF';
    return '#FFB800';
  };

  const spmColor = getSPMColor(clampedSPM);

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

        {/* Target SPM marker */}
        {targetSPM && (() => {
          const targetPercentage = targetSPM / max;
          const targetAngle = -135 + (targetPercentage * 270);
          const targetRad = (targetAngle * Math.PI) / 180;
          const x1 = 100 + Math.cos(targetRad) * 72;
          const y1 = 100 + Math.sin(targetRad) * 72;
          const x2 = 100 + Math.cos(targetRad) * 88;
          const y2 = 100 + Math.sin(targetRad) * 88;
          return (
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22FF88" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          );
        })()}

        {/* Active arc */}
        <motion.path
          d="M 23.58 141.42 A 80 80 0 1 1 176.42 141.42"
          fill="none"
          stroke={spmColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="377"
          initial={{ strokeDashoffset: 377 }}
          animate={{ strokeDashoffset: 377 - (percentage * 377) }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* Glow effect */}
        <motion.path
          d="M 23.58 141.42 A 80 80 0 1 1 176.42 141.42"
          fill="none"
          stroke={spmColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="377"
          initial={{ strokeDashoffset: 377 }}
          animate={{ strokeDashoffset: 377 - (percentage * 377) }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ filter: 'blur(6px)', opacity: 0.3 }}
        />

        {/* Tick marks */}
        {[0, 10, 20, 30, 40].map((tickValue, i) => {
          const tickPercentage = tickValue / max;
          const tickAngle = -135 + (tickPercentage * 270);
          const tickRad = (tickAngle * Math.PI) / 180;
          const x1 = 100 + Math.cos(tickRad) * 75;
          const y1 = 100 + Math.sin(tickRad) * 75;
          const x2 = 100 + Math.cos(tickRad) * 83;
          const y2 = 100 + Math.sin(tickRad) * 83;
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <text
                x={100 + Math.cos(tickRad) * 62}
                y={100 + Math.sin(tickRad) * 62}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.3)"
                fontSize="9"
              >
                {tickValue}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Needle */}
      <motion.div
        className="absolute top-1/2 left-1/2 origin-bottom"
        style={{ width: '2px', height: '58px', marginLeft: '-1px', marginTop: '-58px' }}
        initial={{ rotate: -135 }}
        animate={{ rotate: angle }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="w-full h-full bg-gradient-to-t from-white to-white/50 rounded-full" />
      </motion.div>

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 bg-white rounded-full shadow-lg" />

      {/* Value display */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-5">
        <div
          className="text-2xl font-bold tabular-nums"
          style={{ color: spmColor, textShadow: `0 0 16px ${spmColor}40` }}
        >
          {clampedSPM.toFixed(0)}
        </div>
        {targetSPM && (
          <div className="text-white/40 text-[10px] mt-0.5">/ {targetSPM}</div>
        )}
      </div>

      {/* Label */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-[10px] uppercase tracking-wider">
        SPM
      </div>
    </div>
  );
}
