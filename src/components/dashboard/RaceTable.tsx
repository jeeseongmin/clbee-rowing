import React, { useRef, useLayoutEffect, useCallback } from 'react';
import { Racer, RankChange } from './types';
import { LaneCell } from './LaneCell';
import { MY_ID, SEGMENTS } from './constants';

interface RaceTableProps {
  racers: Racer[];
  rankChanges: RankChange;
  cameraStream: MediaStream | null;
}

export function RaceTable({ racers, rankChanges, cameraStream }: RaceTableProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const prevPositionsRef = useRef<Map<number, DOMRect>>(new Map());

  // Capture positions before render
  const capturePositions = useCallback(() => {
    const container = listRef.current;
    if (!container) return;
    const map = new Map<number, DOMRect>();
    container.querySelectorAll<HTMLElement>('[data-rid]').forEach((el) => {
      const id = Number(el.getAttribute('data-rid'));
      map.set(id, el.getBoundingClientRect());
    });
    prevPositionsRef.current = map;
  }, []);

  // Before DOM update, capture old positions
  useLayoutEffect(() => {
    capturePositions();
  });

  // After DOM update, FLIP animate
  useLayoutEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const oldPositions = prevPositionsRef.current;

    container.querySelectorAll<HTMLElement>('[data-rid]').forEach((el) => {
      const id = Number(el.getAttribute('data-rid'));
      const oldRect = oldPositions.get(id);
      if (!oldRect) return;

      const newRect = el.getBoundingClientRect();
      const dy = oldRect.top - newRect.top;

      if (Math.abs(dy) > 1) {
        el.style.transition = 'none';
        el.style.transform = `translateY(${dy}px)`;
        el.style.zIndex = dy < 0 ? '1' : '2';
        // Force reflow
        el.getBoundingClientRect();
        el.style.transition =
          'transform 500ms cubic-bezier(.4,0,.2,1), z-index 0ms';
        el.style.transform = '';
        const handler = () => {
          el.style.zIndex = '';
          el.removeEventListener('transitionend', handler);
        };
        el.addEventListener('transitionend', handler);
      }
    });
  });

  const sorted = [...racers].sort((a, b) => a.rank - b.rank);

  return (
    <>
      {/* Table Header */}
      <div className="db-thead">
        <div className="db-th">PL</div>
        <div className="db-th" />
        <div className="db-th">NAME</div>
        <div className="db-th">GAP</div>
        <div className="db-th">PASE</div>
        <div className="db-th db-th-lane">
          250m<small>구간 1</small>
        </div>
        <div className="db-th db-th-lane">
          500m<small>구간 2</small>
        </div>
        <div className="db-th db-th-lane">
          750m<small>구간 3</small>
        </div>
        <div className="db-th db-th-lane">
          Finish<small>완주</small>
        </div>
      </div>

      {/* Racer Rows */}
      <div ref={listRef}>
        {sorted.map((r, idx) => {
          const isMe = r.id === MY_ID;
          const is1 = r.rank === 1;
          const isT3 = r.rank <= 3;
          const ch = rankChanges[r.id];

          let rowCls = 'db-row';
          if (isMe) rowCls += ' db-row-me';
          else if (is1) rowCls += ' db-row-first';
          else rowCls += idx % 2 === 0 ? ' db-row-even' : ' db-row-odd';
          if (ch) rowCls += ' db-row-flash';

          const plCls = is1 ? 'db-pl-1' : isT3 ? 'db-pl-top3' : 'db-pl-rest';

          const avStyle: React.CSSProperties = {
            background: `radial-gradient(circle at 35% 35%,${r.bc}44,${r.bc}22)`,
            color: r.bc,
            ...(is1 ? { boxShadow: `0 0 8px ${r.bc}55` } : {}),
          };

          const nameColor = isMe ? '#fca5a5' : is1 ? 'var(--gold)' : '#e2e8f0';
          const gapColor = r.gap === 0 ? 'var(--success)' : 'var(--danger)';
          const gapText = r.gap === 0 ? '—' : String(r.gap);

          return (
            <div className={rowCls} key={r.id} data-rid={r.id}>
              <div className="db-c-pl">
                <span className={`db-pl-n ${plCls}`}>{r.rank}</span>
                {ch && (
                  <span
                    className={`db-pl-ch ${ch === 'up' ? 'db-pl-up' : 'db-pl-dn'}`}
                  >
                    {ch === 'up' ? '▲' : '▼'}
                  </span>
                )}
              </div>
              <div className="db-c-av">
                {isMe && cameraStream ? (
                  <video
                    ref={(el) => {
                      if (el && el.srcObject !== cameraStream) el.srcObject = cameraStream;
                    }}
                    className="db-avatar"
                    style={{ ...avStyle, objectFit: 'cover', transform: 'scaleX(-1)' }}
                    autoPlay
                    playsInline
                    muted
                  />
                ) : r.avatar ? (
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="db-avatar"
                    style={{ ...avStyle, objectFit: 'cover' }}
                  />
                ) : (
                  <div className="db-avatar" style={avStyle}>
                    🚣
                  </div>
                )}
              </div>
              <div
                className="db-c-name"
                style={{
                  color: nameColor,
                  fontWeight: isMe ? 800 : 600,
                }}
              >
                {isMe && <span className="db-me-badge">● ME</span>}
                <div>{r.name}</div>
              </div>
              <div className="db-c-mono" style={{ color: gapColor }}>
                {gapText}
              </div>
              <div className="db-c-mono db-c-pase">{r.pase}</div>
              {SEGMENTS.map(([s, e], li) => (
                <LaneCell
                  key={li}
                  racerId={r.id}
                  rank={r.rank}
                  boatColor={r.bc}
                  progress={r.progress}
                  segStart={s}
                  segEnd={e}
                  isLastSegment={li === 3}
                />
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}
