import React from 'react';

export function RaceHeader() {
  return (
    <div className="db-hdr">
      <div className="db-hdr-left">
        <div className="db-live">
          <span className="db-live-dot" />
          LIVE
        </div>
        <div>
          <div className="db-hdr-title">🏆 1000M RACE</div>
          <div className="db-hdr-sub">Indoor Rowing Challenge · Concept2</div>
        </div>
      </div>
      <div className="db-hdr-right">
        <div className="db-hdr-lbl">Game Title</div>
        <div className="db-hdr-game">화이팅</div>
      </div>
    </div>
  );
}
