import React, { useState, useCallback } from 'react';
import { IntervalSetupScreen } from './IntervalSetupScreen';
import { OverviewScreen } from './OverviewScreen';
import { WorkoutScreen } from './WorkoutScreen';
import { RestScreen } from './RestScreen';
import { SummaryScreen } from './SummaryScreen';
import { Interval, BackgroundVideo, WorkoutSummary, AppScreen } from '../../types/workout';
import { useBackgrounds } from '../../hooks/useBackgrounds';
import { useWorkoutEngine } from '../../hooks/useWorkoutEngine';

function MainApp() {
  const [screen, setScreen] = useState<AppScreen>('setup');
  const [intervals, setIntervals] = useState<Interval[]>([]);
  const [summary, setSummary] = useState<WorkoutSummary | null>(null);

  const {
    allBackgrounds,
    selectedBackground,
    setSelectedBackground,
    uploadVideo,
    removeVideo,
  } = useBackgrounds();

  const handleFinish = useCallback((workoutSummary: WorkoutSummary) => {
    setSummary(workoutSummary);
    setScreen('summary');
  }, []);

  const engine = useWorkoutEngine({
    intervals,
    isActive: screen === 'workout',
    onFinish: handleFinish,
  });

  const handleStartSetup = (newIntervals: Interval[]) => {
    setIntervals(newIntervals);
    setScreen('overview');
  };

  const handleStartOverview = (bg: BackgroundVideo) => {
    setSelectedBackground(bg);
    engine.start();
    setScreen('workout');
  };

  const handleRestart = () => {
    setScreen('setup');
    setIntervals([]);
    setSummary(null);
  };

  return (
    <>
      {screen === 'setup' && <IntervalSetupScreen onStart={handleStartSetup} />}
      {screen === 'overview' && (
        <OverviewScreen
          intervals={intervals}
          backgrounds={allBackgrounds}
          onStart={handleStartOverview}
          onUploadVideo={uploadVideo}
          onDeleteVideo={removeVideo}
        />
      )}
      {screen === 'workout' && !engine.isResting && (
        <WorkoutScreen
          backgroundUrl={selectedBackground.thumbnail}
          videoUrl={selectedBackground.videoUrl}
          isVideo={selectedBackground.isVideo}
          totalTime={engine.totalTime}
          elapsedTime={engine.elapsedTime}
          currentSegmentName={engine.currentInterval?.name || ''}
          intervalProgress={engine.intervalProgress}
          workoutData={engine.workoutData}
          isPaused={engine.isPaused}
          targetStrokeRate={engine.currentInterval?.strokeRate}
          targetDistance={engine.totalTargetDistance}
          onPause={engine.pause}
          onResume={engine.resume}
          onStop={engine.stop}
          onSettings={() => alert('설정 기능은 추후 추가 예정입니다.')}
        />
      )}
      {screen === 'workout' && engine.isResting && (
        <RestScreen
          backgroundUrl={selectedBackground.thumbnail}
          videoUrl={selectedBackground.videoUrl}
          isVideo={selectedBackground.isVideo}
          restTimeRemaining={engine.restTimeRemaining}
          nextSegmentName={intervals[engine.currentIntervalIndex + 1]?.name || '완료'}
        />
      )}
      {screen === 'summary' && summary && (
        <SummaryScreen summary={summary} onRestart={handleRestart} />
      )}
    </>
  );
}

export default MainApp;
