import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playWarningBeep } from '../../utils/audioBeep';
import { formatTime } from '../../utils/formatTime';
import { VideoArea } from '../VideoArea';
import { ArrowRight } from 'lucide-react';

interface RestScreenProps {
  backgroundUrl: string;
  videoUrl?: string;
  isVideo?: boolean;
  restTimeRemaining: number;
  nextSegmentName: string;
}

export function RestScreen({
  backgroundUrl,
  videoUrl,
  isVideo,
  restTimeRemaining,
  nextSegmentName,
}: RestScreenProps) {
  useEffect(() => {
    if (restTimeRemaining === 3) {
      playWarningBeep();
    }
  }, [restTimeRemaining]);

  const isUrgent = restTimeRemaining <= 3;

  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden select-none">
      <VideoArea backgroundUrl={backgroundUrl} videoUrl={videoUrl} isVideo={isVideo} />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {/* Rest label */}
        <div className="text-emerald-400 text-sm uppercase tracking-[0.3em] font-semibold mb-8">
          휴식 시간
        </div>

        {/* Large countdown */}
        <AnimatePresence mode="wait">
          <motion.div
            key={restTimeRemaining}
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="mb-10"
          >
            <div
              className={`text-[10rem] leading-none font-bold tabular-nums ${isUrgent ? 'text-red-400' : 'text-white'}`}
              style={{
                textShadow: isUrgent
                  ? '0 0 60px rgba(239,68,68,0.4), 0 4px 20px rgba(0,0,0,0.8)'
                  : '0 4px 30px rgba(0,0,0,0.8)',
              }}
            >
              {formatTime(restTimeRemaining)}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Next segment indicator */}
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-full px-6 py-3 border border-white/10">
          <span className="text-white/40 text-sm">다음</span>
          <ArrowRight className="h-4 w-4 text-white/20" />
          <span className="text-[#00B8FF] text-lg font-bold">{nextSegmentName}</span>
        </div>
      </div>
    </div>
  );
}
