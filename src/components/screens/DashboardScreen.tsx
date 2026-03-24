import React from 'react';
import { useRaceEngine } from '../dashboard/useRaceEngine';
import { RaceHeader } from '../dashboard/RaceHeader';
import { TimerStrip } from '../dashboard/TimerStrip';
import { RaceTable } from '../dashboard/RaceTable';
import { ProgressBar } from '../dashboard/ProgressBar';
import { StatsBar } from '../dashboard/StatsBar';
import { VideoPanel } from '../dashboard/VideoPanel';
import { FinishOverlay } from '../dashboard/FinishOverlay';
import '../../styles/dashboard.css';

export function DashboardScreen() {
  const {
    racers,
    elapsed,
    running,
    rankChanges,
    speakingId,
    finished,
    winner,
    pause,
    resume,
    reset,
  } = useRaceEngine();

  const handlePauseResume = () => {
    if (running) {
      pause();
    } else {
      resume();
    }
  };

  return (
    <div className="dashboard-root">
      <div className="db-bg-grid" />
      <div className="db-bg-noise" />

      <div className="db-app-layout">
        {/* LEFT: RACE PANEL */}
        <div className="db-race-panel">
          <RaceHeader />
          <TimerStrip elapsed={elapsed} />
          <RaceTable racers={racers} rankChanges={rankChanges} />
          <ProgressBar racers={racers} />
          <StatsBar racers={racers} elapsed={elapsed} />

          {/* Controls */}
          <div className="db-ctrls">
            <button
              className="db-cb"
              onClick={handlePauseResume}
              title="일시정지/재개"
            >
              {running ? '⏸' : '▶️'}
            </button>
            <button className="db-cb" onClick={reset} title="다시시작">
              🔄
            </button>
            <button className="db-cb" title="공유">
              📤
            </button>
          </div>
        </div>

        {/* RIGHT: VIDEO CONFERENCE PANEL */}
        <VideoPanel racers={racers} speakingId={speakingId} />
      </div>

      <FinishOverlay
        visible={finished}
        winner={winner}
        racers={racers}
        onReset={reset}
      />
    </div>
  );
}
