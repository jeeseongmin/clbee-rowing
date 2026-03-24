import { useState, useRef, useCallback, useEffect } from 'react';
import { Racer, RankChange } from './types';
import { MY_ID, RACE_DIST, TICK_MS, BOAT_COLORS, INIT_DATA } from './constants';

export type RacePhase = 'idle' | 'countdown' | 'racing' | 'paused' | 'finished';

function sortRacers(racers: Racer[]): Racer[] {
  const sorted = [...racers].sort((a, b) => b.progress - a.progress);
  sorted.forEach((r, i) => {
    r.rank = i + 1;
    r.gap = i === 0 ? 0 : -Math.round(sorted[0].progress - r.progress);
  });
  return sorted;
}

function createIdleRacers(): Racer[] {
  // All racers start at 0 progress
  const racers = INIT_DATA.map((r) => ({
    ...r,
    progress: 0,
    gap: 0,
    rank: 0,
    bc: BOAT_COLORS[r.id - 1],
    micOn: true,
    camOn: true,
  }));
  // Assign initial rank by id order
  racers.forEach((r, i) => {
    r.rank = i + 1;
  });
  return racers;
}

export function useRaceEngine() {
  const [racers, setRacers] = useState<Racer[]>(createIdleRacers);
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<RacePhase>('idle');
  const [rankChanges, setRankChanges] = useState<RankChange>({});
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [winner, setWinner] = useState<Racer | null>(null);
  const [countdownText, setCountdownText] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speakIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const racersRef = useRef(racers);
  racersRef.current = racers;

  const tick = useCallback(() => {
    setElapsed((prev) => prev + 1);

    setRacers((prev) => {
      const oldRanks: Record<number, number> = {};
      prev.forEach((r) => {
        oldRanks[r.id] = r.rank;
      });

      const updated = prev.map((r) => {
        let base: number;
        if (r.id === 1) {
          base = 2.6;
        } else if (r.id === 3) {
          base = 3.8 + Math.random() * 0.8;
        } else {
          base = 1.2 + Math.random() * 0.8;
        }
        const jitter = (Math.random() - 0.35) * 1.2;
        const newProgress = Math.min(r.progress + Math.max(base + jitter, 0.3), RACE_DIST);
        return { ...r, progress: newProgress };
      });

      const sorted = sortRacers(updated);

      const changes: RankChange = {};
      sorted.forEach((r) => {
        if (oldRanks[r.id] !== r.rank) {
          changes[r.id] = r.rank < oldRanks[r.id] ? 'up' : 'down';
        }
      });
      setRankChanges(changes);
      setTimeout(() => setRankChanges({}), 700);

      if (sorted.every((r) => r.progress >= RACE_DIST)) {
        setPhase('finished');
        setWinner(sorted[0]);
      }

      return sorted;
    });
  }, []);

  // Race timer
  useEffect(() => {
    if (phase === 'racing') {
      timerRef.current = setInterval(tick, TICK_MS);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, tick]);

  // Speaking indicator
  useEffect(() => {
    if (phase !== 'racing') return;
    speakIntervalRef.current = setInterval(() => {
      const current = racersRef.current;
      const id = current[Math.floor(Math.random() * current.length)].id;
      setSpeakingId(id);
      setTimeout(() => setSpeakingId(null), 1800 + Math.random() * 1200);
    }, 3500);
    return () => {
      if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
    };
  }, [phase]);

  // Countdown sequence: Ready -> 3 -> 2 -> 1 -> Go! -> race
  const startCountdown = useCallback(() => {
    setPhase('countdown');

    const sequence = ['Ready', '3', '2', '1', 'Go!'];
    let i = 0;

    const showNext = () => {
      if (i < sequence.length) {
        setCountdownText(sequence[i]);
        i++;
        setTimeout(showNext, 900);
      } else {
        setCountdownText(null);
        setPhase('racing');
      }
    };

    showNext();
  }, []);

  const pause = useCallback(() => {
    if (phase === 'racing') setPhase('paused');
  }, [phase]);

  const resume = useCallback(() => {
    if (phase === 'paused') setPhase('racing');
  }, [phase]);

  const reset = useCallback(() => {
    setRacers(createIdleRacers());
    setElapsed(0);
    setPhase('idle');
    setRankChanges({});
    setSpeakingId(null);
    setWinner(null);
    setCountdownText(null);
  }, []);

  const myRacer = racers.find((r) => r.id === MY_ID) || null;
  const running = phase === 'racing';
  const finished = phase === 'finished';

  return {
    racers,
    elapsed,
    phase,
    running,
    rankChanges,
    speakingId,
    finished,
    winner,
    myRacer,
    countdownText,
    startCountdown,
    pause,
    resume,
    reset,
  };
}
