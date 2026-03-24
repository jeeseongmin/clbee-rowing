export interface Racer {
  id: number;
  name: string;
  gap: number;
  pase: string;
  progress: number;
  rank: number;
  bc: string;
  micOn: boolean;
  camOn: boolean;
}

export interface RankChange {
  [id: number]: 'up' | 'down';
}
