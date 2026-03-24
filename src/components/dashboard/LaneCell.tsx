import React from 'react';
import { BoatSvg } from './BoatSvg';
import { MY_ID } from './constants';

interface LaneCellProps {
  racerId: number;
  rank: number;
  boatColor: string;
  progress: number;
  segStart: number;
  segEnd: number;
  isLastSegment: boolean;
}

function segPct(prog: number, s: number, e: number): number {
  if (prog >= e) return 100;
  if (prog <= s) return 0;
  return ((prog - s) / (e - s)) * 100;
}

export function LaneCell({
  racerId,
  rank,
  boatColor,
  progress,
  segStart,
  segEnd,
  isLastSegment,
}: LaneCellProps) {
  const pct = segPct(progress, segStart, segEnd);
  const passed = pct >= 100;
  const active = pct > 0 && pct < 100;
  const is1 = rank === 1;
  const isMe = racerId === MY_ID;

  let fillBg = '';
  if (passed) fillBg = 'linear-gradient(90deg,rgba(16,185,129,.12),rgba(16,185,129,.06))';
  else if (active) fillBg = `linear-gradient(90deg,transparent,${boatColor}20)`;

  let boatFilter = 'drop-shadow(0 1px 3px rgba(0,0,0,.45))';
  if (is1) boatFilter = 'drop-shadow(0 0 7px rgba(251,191,36,.6))';
  else if (isMe) boatFilter = 'drop-shadow(0 0 6px rgba(239,68,68,.5))';

  return (
    <div className="db-c-lane">
      <div className="db-lane">
        <div className="db-lane-water" />
        <div className="db-lane-ripple" />
        <div
          className="db-lane-fill"
          style={{
            width: `${passed ? 100 : pct}%`,
            background: fillBg,
          }}
        />
        {active && (
          <div
            className="db-lane-boat"
            style={{
              left: `calc(${pct}% - 28px)`,
              filter: boatFilter,
            }}
          >
            <BoatSvg color={boatColor} width={44} />
          </div>
        )}
        {passed && isLastSegment && (
          <div className="db-lane-mark db-lane-flag">🏁</div>
        )}
        {passed && !isLastSegment && (
          <div className="db-lane-mark db-lane-check">✓</div>
        )}
      </div>
    </div>
  );
}
