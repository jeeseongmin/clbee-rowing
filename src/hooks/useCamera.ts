import { useState, useEffect } from 'react';

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);

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

  return stream;
}
