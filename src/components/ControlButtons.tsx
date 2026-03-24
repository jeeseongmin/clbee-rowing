import React from 'react';
import { Pause, Play, Square, Settings } from 'lucide-react';

interface ControlButtonsProps {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onSettings: () => void;
}

export function ControlButtons({
  isPaused,
  onPause,
  onResume,
  onStop,
  onSettings,
}: ControlButtonsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-full px-4 py-2 border border-white/10">
        <button
          onClick={onSettings}
          className="w-11 h-11 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <Settings className="h-5 w-5" />
        </button>

        <div className="w-px h-6 bg-white/10" />

        {isPaused ? (
          <button
            onClick={onResume}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #00B8FF, #0090CC)',
              boxShadow: '0 0 20px rgba(0, 184, 255, 0.4)',
            }}
          >
            <Play className="h-7 w-7 ml-0.5" />
          </button>
        ) : (
          <button
            onClick={onPause}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all"
          >
            <Pause className="h-7 w-7" />
          </button>
        )}

        <div className="w-px h-6 bg-white/10" />

        <button
          onClick={onStop}
          className="w-11 h-11 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <Square className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
