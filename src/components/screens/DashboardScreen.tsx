import React from 'react';
import { useRaceEngine } from '../dashboard/useRaceEngine';
import { RaceHeader } from '../dashboard/RaceHeader';
import { TimerStrip } from '../dashboard/TimerStrip';
import { RaceTable } from '../dashboard/RaceTable';
import { ProgressBar } from '../dashboard/ProgressBar';
import { StatsBar } from '../dashboard/StatsBar';
import { VideoPanel } from '../dashboard/VideoPanel';
import { FinishOverlay } from '../dashboard/FinishOverlay';
import { CountdownOverlay } from '../dashboard/CountdownOverlay';
import '../../styles/dashboard.css';

export function DashboardScreen() {
  const {
    racers,
    elapsed,
    phase,
    running,
    rankChanges,
    speakingId,
    finished,
    winner,
    countdownText,
    startCountdown,
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
            {phase === 'idle' ? (
              <button
                className="db-cb"
                onClick={startCountdown}
                style={{
                  background: 'linear-gradient(135deg, #00B8FF, #0090CC)',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 700,
                  padding: '8px 28px',
                  border: 'none',
                  boxShadow: '0 0 16px rgba(0,184,255,0.3)',
                }}
              >
                🏁 START
              </button>
            ) : (
              <>
                <button
                  className="db-cb"
                  onClick={handlePauseResume}
                  title="일시정지/재개"
                  disabled={phase === 'countdown' || finished}
                >
                  {running ? '⏸' : '▶️'}
                </button>
                <button className="db-cb" onClick={reset} title="다시시작">
                  🔄
                </button>
                <button className="db-cb" title="공유">
                  📤
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: VIDEO CONFERENCE PANEL */}
        <VideoPanel racers={racers} speakingId={speakingId} />
      </div>

      {/* Countdown overlay */}
      <CountdownOverlay text={countdownText} />

      <FinishOverlay
        visible={finished}
        winner={winner}
        racers={racers}
        onReset={reset}
      />
    </div>
  );
}
