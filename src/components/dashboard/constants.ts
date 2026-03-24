export const MY_ID = 3;
export const RACE_DIST = 1000;
export const TICK_MS = 820;

export const BOAT_COLORS = [
  '#f59e0b', '#60a5fa', '#ef4444', '#a78bfa', '#34d399', '#fb923c', '#f472b6',
];

export const INIT_DATA = [
  { id: 1, name: '김을동', gap: 0, pase: '1:15', progress: 520, avatar: '/avatars/man1.jpg' },
  { id: 2, name: '김이동', gap: -21, pase: '1:18', progress: 380, avatar: '/avatars/man2.jpg' },
  { id: 4, name: '박은실', gap: -32, pase: '1:22', progress: 290, avatar: '/avatars/woman1.jpg' },
  { id: 5, name: '최현욱', gap: -53, pase: '1:25', progress: 240, avatar: '/avatars/man3.jpg' },
  { id: 7, name: '박정균', gap: -23, pase: '1:28', progress: 200, avatar: '/avatars/man4.jpg' },
  { id: 6, name: '김은동', gap: -93, pase: '1:30', progress: 180, avatar: '/avatars/woman2.jpg' },
  { id: 3, name: '김갑동', gap: -150, pase: '1:35', progress: 100, avatar: null }, // ME - uses camera
];

export const SEGMENTS: [number, number][] = [
  [0, 250],
  [250, 500],
  [500, 750],
  [750, 1000],
];
