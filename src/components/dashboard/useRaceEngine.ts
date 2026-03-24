import { useState, useRef, useCallback, useEffect } from 'react';
import { Racer, RankChange } from './types';
import { MY_ID, RACE_DIST, TICK_MS, BOAT_COLORS, INIT_DATA } from './constants';

function sortRacers(racers: Racer[]): Racer[] {
  const sorted = [...racers].sort((a, b) => b.progress - a.progress);
  sorted.forEach((r, i) => {
    r.rank = i + 1;
    r.gap = i === 0 ? 0 : -Math.round(sorted[0].progress - r.progress);
  });
  return sorted;
}

function createInitialRacers(): Racer[] {
  const racers = INIT_DATA.map((r, i) => ({
    ...r,
    rank: i + 1,
    bc: BOAT_COLORS[r.id - 1],
    micOn: true,
    camOn: true,
  }));
  return sortRacers(racers);
}

export function useRaceEngine() {
  const [racers, setRacers] = useState<Racer[]>(createInitialRacers);
  const [elapsed, setElapsed] = useState(132);
  const [running, setRunning] = useState(true);
  const [rankChanges, setRankChanges] = useState<RankChange>({});
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [winner, setWinner] = useState<Racer | null>(null);

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

      // Clear rank changes after animation
      setTimeout(() => setRankChanges({}), 700);

      // Check finish
      if (sorted.every((r) => r.progress >= RACE_DIST)) {
        setFinished(true);
        setWinner(sorted[0]);
        // Stop timer will be handled in effect
      }

      return sorted;
    });
  }, []);

  // Start/stop race timer
  useEffect(() => {
    if (running && !finished) {
      timerRef.current = setInterval(tick, TICK_MS);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, finished, tick]);

  // Speaking indicator cycle
  useEffect(() => {
    if (!running) return;
    speakIntervalRef.current = setInterval(() => {
      const current = racersRef.current;
      const id = current[Math.floor(Math.random() * current.length)].id;
      setSpeakingId(id);
      setTimeout(() => setSpeakingId(null), 1800 + Math.random() * 1200);
    }, 3500);
    return () => {
      if (speakIntervalRef.current) clearInterval(speakIntervalRef.current);
    };
  }, [running]);

  // Stop when finished
  useEffect(() => {
    if (finished) {
      setRunning(false);
    }
  }, [finished]);

  const pause = useCallback(() => {
    setRunning(false);
  }, []);

  const resume = useCallback(() => {
    if (!finished) {
      setRunning(true);
    }
  }, [finished]);

  const reset = useCallback(() => {
    setRacers(createInitialRacers());
    setElapsed(132);
    setRunning(true);
    setRankChanges({});
    setSpeakingId(null);
    setFinished(false);
    setWinner(null);
  }, []);

  const myRacer = racers.find((r) => r.id === MY_ID) || null;

  return {
    racers,
    elapsed,
    running,
    rankChanges,
    speakingId,
    finished,
    winner,
    myRacer,
    pause,
    resume,
    reset,
  };
}
