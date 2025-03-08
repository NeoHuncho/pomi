export interface Timer {
  id: string;
  startTime: number;
  duration: number;
  type: 'work' | 'break';
  status: 'running' | 'paused' | 'completed';
}

export interface TimerState {
  currentTimer: Timer | null;
  participants: string[];
}
