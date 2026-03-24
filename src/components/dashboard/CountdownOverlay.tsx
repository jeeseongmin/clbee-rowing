import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RacePhase } from './useRaceEngine';

interface CountdownOverlayProps {
  phase: RacePhase;
  text: string | null;
}

export function CountdownOverlay({ phase, text }: CountdownOverlayProps) {
  const visible = phase === 'countdown';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="countdown-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatePresence mode="wait">
            {text && (
              <motion.div
                key={text}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  color: text === 'Go!' ? '#22FF88' : '#ffffff',
                  fontSize: text === 'Ready' ? '5rem' : text === 'Go!' ? '7rem' : '9rem',
                  fontWeight: 900,
                  fontFamily: "'JetBrains Mono', monospace",
                  letterSpacing: text === 'Ready' ? '0.1em' : '0.05em',
                  textShadow:
                    text === 'Go!'
                      ? '0 0 60px rgba(34,255,136,0.6), 0 0 120px rgba(34,255,136,0.3)'
                      : '0 0 40px rgba(0,184,255,0.4), 0 4px 20px rgba(0,0,0,0.8)',
                  userSelect: 'none',
                }}
              >
                {text}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
