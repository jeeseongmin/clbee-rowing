import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { Racer } from './types';
import { MY_ID, RACE_DIST } from './constants';

interface VideoPanelProps {
  racers: Racer[];
  speakingId: number | null;
}

export function VideoPanel({ racers, speakingId }: VideoPanelProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const prevPositionsRef = useRef<Map<number, DOMRect>>(new Map());
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Request camera for ME
  useEffect(() => {
    let cancelled = false;
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((s) => {
          if (!cancelled) setStream(s);
        })
        .catch(() => {
          // Camera not available
        });
    }
    return () => {
      cancelled = true;
    };
  }, []);

  // Attach stream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  });

  // FLIP animation
  useLayoutEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const map = new Map<number, DOMRect>();
    container.querySelectorAll<HTMLElement>('[data-vid]').forEach((el) => {
      const id = Number(el.getAttribute('data-vid'));
      map.set(id, el.getBoundingClientRect());
    });
    prevPositionsRef.current = map;
  });

  useLayoutEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const oldPositions = prevPositionsRef.current;

    container.querySelectorAll<HTMLElement>('[data-vid]').forEach((el) => {
      const id = Number(el.getAttribute('data-vid'));
      const oldRect = oldPositions.get(id);
      if (!oldRect) return;

      const newRect = el.getBoundingClientRect();
      const dy = oldRect.top - newRect.top;

      if (Math.abs(dy) > 1) {
        el.style.transition = 'none';
        el.style.transform = `translateY(${dy}px)`;
        el.style.zIndex = dy < 0 ? '1' : '2';
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
    <div className="db-video-panel">
      <div className="db-vp-header">
        <div className="db-vp-title">
          <span className="db-vp-title-icon">📹</span>
          참가자 화상회의
          <span className="db-vp-count">{sorted.length}명</span>
        </div>
        <div className="db-vp-subtitle">레이스 중 실시간 화상 연결</div>
      </div>

      <div className="db-vp-list" ref={listRef}>
        {sorted.map((r) => {
          const isMe = r.id === MY_ID;
          const is1 = r.rank === 1;
          const isSpeaking = speakingId === r.id;
          const pct = Math.min((r.progress / RACE_DIST) * 100, 100);
          const dist = Math.round(r.progress);
          const remaining = Math.max(0, RACE_DIST - dist);

          let cardCls = 'db-vc';
          if (isMe) cardCls += ' db-vc-me';
          else if (is1) cardCls += ' db-vc-first';
          if (isSpeaking) cardCls += ' db-vc-speaking';

          let rankCls = 'db-vc-rank-rest';
          if (r.rank === 1) rankCls = 'db-vc-rank-1';
          else if (r.rank <= 3) rankCls = 'db-vc-rank-top';

          const rankLabel =
            r.rank === 1
              ? '1st'
              : r.rank === 2
                ? '2nd'
                : r.rank === 3
                  ? '3rd'
                  : `${r.rank}th`;

          return (
            <div className={cardCls} key={r.id} data-vid={r.id}>
              <div className="db-vc-thumb">
                {isMe && stream ? (
                  <video
                    ref={isMe ? videoRef : undefined}
                    className="db-vc-cam-video"
                    autoPlay
                    playsInline
                    muted
                  />
                ) : (
                  <div
                    className="db-vc-thumb-bg"
                    style={{
                      background: `radial-gradient(circle at 35% 35%,${r.bc}44,${r.bc}15)`,
                    }}
                  >
                    🚣
                  </div>
                )}
                {isSpeaking && (
                  <div className="db-vc-speak-bar">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                )}
                <div
                  className={`db-vc-mic-badge ${r.micOn ? 'db-vc-mic-on' : 'db-vc-mic-off'}`}
                >
                  {r.micOn ? '🎙' : '🔇'}
                </div>
              </div>

              <div className="db-vc-info">
                <div className="db-vc-info-top">
                  <span className="db-vc-name">{r.name}</span>
                  {isMe && <span className="db-vc-me-tag">ME</span>}
                </div>
                <div className="db-vc-progress">
                  <div
                    className="db-vc-progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg,${r.bc}88,${r.bc})`,
                    }}
                  />
                </div>
                <div className="db-vc-dist">
                  {dist}m / {RACE_DIST}m
                  {remaining > 0 ? ` · 남은 ${remaining}m` : ' · 완주!'}
                </div>
              </div>

              <div className="db-vc-rank-col">
                <div className={`db-vc-rank ${rankCls}`}>{r.rank}</div>
                <div className="db-vc-rank-label">{rankLabel}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="db-vp-footer">
        <button className="db-vp-btn db-vp-btn-active" title="마이크">
          <span>🎙</span>
        </button>
        <button className="db-vp-btn db-vp-btn-active" title="카메라">
          <span>📷</span>
        </button>
        <button className="db-vp-btn db-vp-btn-default" title="화면공유">
          <span>🖥</span>
        </button>
        <button className="db-vp-btn db-vp-btn-default" title="채팅">
          <span>💬</span>
        </button>
        <button className="db-vp-btn db-vp-btn-danger" title="나가기">
          <span>📴</span>
        </button>
      </div>
    </div>
  );
}
