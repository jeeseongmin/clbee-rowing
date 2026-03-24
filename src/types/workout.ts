export interface Interval {
  id: string;
  name: string;
  strokeRate: number;
  duration?: number;
  distance?: number;
  restTime: number;
}

export interface WorkoutData {
  currentStrokeRate: number;
  currentSpeed: number;
  totalDistance: number;
  elapsedTime: number;
  strokeHistory: number[];
}

export interface WorkoutSummary {
  totalTime: number;
  totalDistance: number;
  averageStrokeRate: number;
  averageSpeed: number;
  intervals: {
    name: string;
    time: number;
    distance: number;
    avgStrokeRate: number;
  }[];
}

export type AppScreen = 'setup' | 'overview' | 'workout' | 'rest' | 'summary';

export interface BackgroundVideo {
  id: string;
  name: string;
  thumbnail: string;
  category: '호수' | '강' | '체육관' | '바다' | '업로드';
  videoUrl?: string;
  isVideo?: boolean;
}
