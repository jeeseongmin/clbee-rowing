import { useReducer, useEffect, useRef, useCallback } from 'react';
import { Interval, WorkoutData, WorkoutSummary } from '../types/workout';
import { playIntervalBeep } from '../utils/audioBeep';

interface WorkoutState {
  elapsedTime: number;
  intervalElapsedTime: number;
  currentIntervalIndex: number;
  isPaused: boolean;
  isResting: boolean;
  restTimeRemaining: number;
  workoutData: WorkoutData;
  finished: boolean;
}

type WorkoutAction =
  | { type: 'TICK' }
  | { type: 'REST_TICK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'FINISH' }
  | { type: 'START_REST'; restTime: number }
  | { type: 'END_REST' }
  | { type: 'RESET' };

const initialState: WorkoutState = {
  elapsedTime: 0,
  intervalElapsedTime: 0,
  currentIntervalIndex: 0,
  isPaused: false,
  isResting: false,
  restTimeRemaining: 0,
  workoutData: {
    currentStrokeRate: 0,
    currentSpeed: 120,
    totalDistance: 0,
    elapsedTime: 0,
    strokeHistory: [0],
  },
  finished: false,
};

function simulateStroke(prev: WorkoutData, targetStrokeRate: number): WorkoutData {
  const variation = (Math.random() - 0.5) * 4;
  const newStrokeRate = Math.max(0, targetStrokeRate + variation);
  const speedVariation = (Math.random() - 0.5) * 10;
  const newSpeed = Math.max(90, Math.min(180, 120 + speedVariation));
  const distanceIncrement = (500 / newSpeed) * 1;

  return {
    currentStrokeRate: newStrokeRate,
    currentSpeed: newSpeed,
    totalDistance: prev.totalDistance + distanceIncrement,
    elapsedTime: prev.elapsedTime + 1,
    strokeHistory: [...prev.strokeHistory.slice(-19), newStrokeRate],
  };
}

function reducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'TICK':
      return {
        ...state,
        elapsedTime: state.elapsedTime + 1,
        intervalElapsedTime: state.intervalElapsedTime + 1,
      };
    case 'REST_TICK':
      return {
        ...state,
        restTimeRemaining: state.restTimeRemaining - 1,
      };
    case 'PAUSE':
      return { ...state, isPaused: true };
    case 'RESUME':
      return { ...state, isPaused: false };
    case 'FINISH':
      return { ...state, finished: true, isPaused: true };
    case 'START_REST':
      return {
        ...state,
        isResting: true,
        restTimeRemaining: action.restTime,
      };
    case 'END_REST':
      return {
        ...state,
        isResting: false,
        restTimeRemaining: 0,
        currentIntervalIndex: state.currentIntervalIndex + 1,
        intervalElapsedTime: 0,
      };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

interface UseWorkoutEngineParams {
  intervals: Interval[];
  isActive: boolean;
  onFinish: (summary: WorkoutSummary) => void;
}

export function useWorkoutEngine({ intervals, isActive, onFinish }: UseWorkoutEngineParams) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const intervalDataRef = useRef<WorkoutSummary['intervals']>([]);
  const workoutDataRef = useRef(state.workoutData);
  const stateRef = useRef(state);

  // Keep refs in sync
  stateRef.current = state;

  useEffect(() => {
    if (!isActive || state.isPaused || state.finished || intervals.length === 0) return;

    const timer = setInterval(() => {
      const s = stateRef.current;

      if (s.isResting) {
        if (s.restTimeRemaining <= 1) {
          dispatch({ type: 'END_REST' });
          playIntervalBeep();
        } else {
          dispatch({ type: 'REST_TICK' });
        }
        return;
      }

      const currentInterval = intervals[s.currentIntervalIndex];
      if (!currentInterval) {
        finishWorkout();
        return;
      }

      // Simulate workout data
      const newData = simulateStroke(workoutDataRef.current, currentInterval.strokeRate);
      workoutDataRef.current = newData;

      dispatch({ type: 'TICK' });

      // Check interval completion
      if (currentInterval.duration && s.intervalElapsedTime >= currentInterval.duration - 1) {
        const avgSPM = newData.strokeHistory.length > 0
          ? newData.strokeHistory.reduce((a, b) => a + b, 0) / newData.strokeHistory.length
          : 0;

        intervalDataRef.current.push({
          name: currentInterval.name,
          time: s.intervalElapsedTime + 1,
          distance: newData.totalDistance,
          avgStrokeRate: avgSPM,
        });

        if (s.currentIntervalIndex < intervals.length - 1) {
          dispatch({ type: 'START_REST', restTime: currentInterval.restTime });
          playIntervalBeep();
        } else {
          finishWorkout();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, state.isPaused, state.finished, state.isResting, state.currentIntervalIndex, state.intervalElapsedTime, intervals]);

  const finishWorkout = useCallback(() => {
    dispatch({ type: 'FINISH' });
    const data = workoutDataRef.current;
    const avgStrokeRate = data.strokeHistory.length > 0
      ? data.strokeHistory.reduce((a, b) => a + b, 0) / data.strokeHistory.length
      : 0;

    onFinish({
      totalTime: stateRef.current.elapsedTime,
      totalDistance: data.totalDistance,
      averageStrokeRate: avgStrokeRate,
      averageSpeed: data.currentSpeed,
      intervals: intervalDataRef.current,
    });
  }, [onFinish]);

  const start = useCallback(() => {
    dispatch({ type: 'RESET' });
    workoutDataRef.current = initialState.workoutData;
    intervalDataRef.current = [];
    setTimeout(() => playIntervalBeep(), 500);
  }, []);

  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const resume = useCallback(() => dispatch({ type: 'RESUME' }), []);

  const stop = useCallback(() => {
    if (confirm('운동을 종료하시겠습니까?')) {
      finishWorkout();
    }
  }, [finishWorkout]);

  const currentInterval = intervals[state.currentIntervalIndex];
  const intervalProgress = currentInterval?.duration
    ? (state.intervalElapsedTime / currentInterval.duration) * 100
    : 0;

  const totalTime = intervals.reduce((sum, i) => sum + (i.duration || 0) + i.restTime, 0);

  const totalTargetDistance = intervals.reduce((sum, interval) => {
    const estimatedDistance = interval.duration ? (interval.duration / 120) * 500 : 0;
    return sum + estimatedDistance;
  }, 0);

  return {
    ...state,
    workoutData: workoutDataRef.current,
    currentInterval,
    intervalProgress,
    totalTime,
    totalTargetDistance,
    start,
    pause,
    resume,
    stop,
  };
}
