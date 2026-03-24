export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimeKorean(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  return `${mins}분 ${seconds % 60}초`;
}
