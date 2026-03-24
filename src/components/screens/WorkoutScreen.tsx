import React, { useRef, useEffect } from 'react';
import { VideoArea } from '../VideoArea';
import { WorkoutData } from '../../types/workout';
import { motion, AnimatePresence } from 'motion/react';
import { playStrokeBeep } from '../../utils/audioBeep';
import { formatTime } from '../../utils/formatTime';
import { Pause, Play, Square, Settings } from 'lucide-react';

interface WorkoutScreenProps {
  backgroundUrl: string;
  videoUrl?: string;
  isVideo?: boolean;
  totalTime: number;
  elapsedTime: number;
  currentSegmentName: string;
  intervalProgress: number;
  workoutData: WorkoutData;
  isPaused: boolean;
  targetStrokeRate?: number;
  targetDistance?: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSettings: () => void;
}

export function WorkoutScreen({
  backgroundUrl,
  videoUrl,
  isVideo,
  totalTime,
  elapsedTime,
  currentSegmentName,
  intervalProgress,
  workoutData,
  isPaused,
  targetStrokeRate,
  targetDistance,
  onPause,
  onResume,
  onStop,
  onSettings,
}: WorkoutScreenProps) {
  const beepIntervalRef = useRef<number | null>(null);
  const remaining = Math.max(0, totalTime - elapsedTime);
  const currentSPM = workoutData.strokeHistory[workoutData.strokeHistory.length - 1] || 0;
  const distance = workoutData.totalDistance;
  const pace = workoutData.currentSpeed;

  // SPM color
  const getSPMColor = () => {
    if (!targetStrokeRate) return '#00B8FF';
    const diff = Math.abs(currentSPM - targetStrokeRate);
    if (diff < 2) return '#22FF88';
    if (diff < 5) return '#00B8FF';
    return '#FFB800';
  };

  // Pace color
  const getPaceColor = () => {
    if (pace < 90) return '#22FF88';
    if (pace < 120) return '#00B8FF';
    if (pace < 150) return '#FFB800';
    return '#FF4444';
  };

  useEffect(() => {
    if (beepIntervalRef.current) {
      clearInterval(beepIntervalRef.current);
      beepIntervalRef.current = null;
    }
    if (!isPaused && targetStrokeRate && targetStrokeRate > 0) {
      const intervalMs = (60 / targetStrokeRate) * 1000;
      playStrokeBeep();
      beepIntervalRef.current = window.setInterval(() => {
        playStrokeBeep();
      }, intervalMs);
    }
    return () => {
      if (beepIntervalRef.current) {
        clearInterval(beepIntervalRef.current);
        beepIntervalRef.current = null;
      }
    };
  }, [isPaused, targetStrokeRate]);

  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden select-none">
      {/* Background - full screen */}
      <VideoArea backgroundUrl={backgroundUrl} videoUrl={videoUrl} isVideo={isVideo} />

      {/* Subtle vignette for readability */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.5) 100%)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to right, rgba(0,0,0,0.15) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.15) 100%)',
      }} />

      {/* ═══ TOP BAR ═══ */}
      <div className="absolute top-0 left-0 right-0 z-10">
        {/* Segment name - center */}
        <div className="flex justify-center pt-6">
          <div className="bg-black/50 backdrop-blur-xl rounded-full px-8 py-2 border border-white/10">
            <span className="text-[#00B8FF] text-lg font-bold tracking-wide" style={{ textShadow: '0 0 20px rgba(0,184,255,0.4)' }}>
              {currentSegmentName}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-8 mt-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${intervalProgress}%`,
                background: 'linear-gradient(90deg, #00B8FF, #22FF88)',
                boxShadow: '0 0 8px rgba(0,184,255,0.5)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ═══ MAIN METRICS - Large, centered display ═══ */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="flex items-end gap-16">
          {/* Time - large center display */}
          <div className="text-center">
            <div className="text-white/30 text-xs uppercase tracking-[0.2em] mb-2">경과 시간</div>
            <div className="text-white text-7xl font-bold tabular-nums tracking-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
              {formatTime(elapsedTime)}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM HUD ═══ */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        {/* Metrics row */}
        <div className="flex justify-center gap-2 px-6 mb-4">
          {/* SPM */}
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10 min-w-[140px] text-center">
            <div className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-1">SPM</div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold tabular-nums" style={{ color: getSPMColor(), textShadow: `0 0 20px ${getSPMColor()}30` }}>
                {currentSPM.toFixed(0)}
              </span>
              {targetStrokeRate && (
                <span className="text-white/30 text-sm">/{targetStrokeRate}</span>
              )}
            </div>
          </div>

          {/* Pace */}
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10 min-w-[140px] text-center">
            <div className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-1">페이스 /500m</div>
            <div className="text-5xl font-bold tabular-nums" style={{ color: getPaceColor(), textShadow: `0 0 20px ${getPaceColor()}30` }}>
              {formatTime(pace)}
            </div>
          </div>

          {/* Distance */}
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10 min-w-[140px] text-center">
            <div className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-1">거리</div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold tabular-nums" style={{ color: '#22FF88', textShadow: '0 0 20px rgba(34,255,136,0.3)' }}>
                {distance.toFixed(0)}
              </span>
              <span className="text-white/30 text-sm">m</span>
            </div>
          </div>

          {/* Remaining */}
          <div className="bg-black/50 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/10 min-w-[140px] text-center">
            <div className="text-white/30 text-[10px] uppercase tracking-[0.15em] mb-1">남은 시간</div>
            <div className="text-5xl font-bold tabular-nums text-white/70" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
              {formatTime(remaining)}
            </div>
          </div>
        </div>

      </div>

      {/* ═══ CONTROLS - independent z-40, above pause overlay ═══ */}
      <div className="absolute bottom-0 left-0 right-0 z-40">
        <div className="flex justify-center pb-6">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl rounded-full px-3 py-1.5 border border-white/10">
            <button
              onClick={onSettings}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
            >
              <Settings className="h-4 w-4" />
            </button>
            <div className="w-px h-5 bg-white/10" />
            {isPaused ? (
              <button
                onClick={onResume}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #00B8FF, #0090CC)', boxShadow: '0 0 16px rgba(0,184,255,0.4)' }}
              >
                <Play className="h-6 w-6 ml-0.5" />
              </button>
            ) : (
              <button
                onClick={onPause}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white/70 bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
              >
                <Pause className="h-6 w-6" />
              </button>
            )}
            <div className="w-px h-5 bg-white/10" />
            <button
              onClick={onStop}
              className="w-10 h-10 rounded-full flex items-center justify-center text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
            >
              <Square className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ PAUSE OVERLAY - click anywhere to resume ═══ */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm cursor-pointer"
            onClick={onResume}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="text-center pointer-events-none"
            >
              <div className="w-24 h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-6 hover:bg-white/20 transition-colors">
                <Play className="h-12 w-12 text-white ml-1" />
              </div>
              <div className="text-white text-3xl font-semibold mb-2">일시정지</div>
              <div className="text-white/40 text-sm">화면을 터치하면 재개됩니다</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
