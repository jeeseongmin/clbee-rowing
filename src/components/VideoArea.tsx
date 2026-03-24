import React, { useRef, useEffect } from 'react';

interface VideoAreaProps {
  backgroundUrl: string;
  videoUrl?: string;
  isVideo?: boolean;
}

export function VideoArea({ backgroundUrl, videoUrl, isVideo }: VideoAreaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && isVideo) {
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay prevented:', err);
      });
    }
  }, [isVideo, videoUrl]);

  if (isVideo && videoUrl) {
    return (
      <video
        ref={videoRef}
        src={videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
        autoPlay
      />
    );
  }

  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundUrl})` }}
    />
  );
}
