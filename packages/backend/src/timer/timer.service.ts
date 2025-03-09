// filepath: /Users/william/Documents/personal/pomi/packages/backend/src/timer/timer.service.ts
import { Injectable } from '@nestjs/common';
import { Timer } from '@pomi/shared/src/types';
import { Redis } from 'ioredis';
@Injectable()
export class TimerService {
  public redis: Redis;
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    console.log('redisUrl:', redisUrl);
    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined');
    }
    this.redis = new Redis(redisUrl);
  }

  async startTimer(): Promise<Timer> {
    const timer: Timer = {
      id: Date.now().toString(),
      startTime: Date.now(),
      duration: 25 * 60 * 1000,
      type: 'work',
      status: 'running',
      remainingTime: 25 * 60 * 1000,
    };

    await this.redis.set('current_timer', JSON.stringify(timer));
    this.startCountdown(timer);
    return timer;
  }

  async pauseTimer(): Promise<Timer | null> {
    const timerStr = await this.redis.get('current_timer');
    if (!timerStr) return null;

    const timer: Timer = JSON.parse(timerStr);
    timer.status = 'paused';
    this.stopCountdown(timer.id);

    await this.redis.set('current_timer', JSON.stringify(timer));
    return timer;
  }

  private startCountdown(timer: Timer) {
    this.stopCountdown(timer.id); // Clear any existing interval

    const interval = setInterval(async () => {
      const currentTimerStr = await this.redis.get('current_timer');
      if (!currentTimerStr) {
        this.stopCountdown(timer.id);
        return;
      }

      const currentTimer: Timer = JSON.parse(currentTimerStr);
      if (currentTimer.status !== 'running') {
        this.stopCountdown(timer.id);
        return;
      }

      currentTimer.remainingTime = Math.max(
        0,
        currentTimer.duration - (Date.now() - currentTimer.startTime)
      );

      if (currentTimer.remainingTime <= 0) {
        currentTimer.status = 'completed';
        this.stopCountdown(timer.id);
      }

      await this.redis.set('current_timer', JSON.stringify(currentTimer));
      return currentTimer;
    }, 1000);

    this.intervals.set(timer.id, interval);
  }

  private stopCountdown(timerId: string) {
    const interval = this.intervals.get(timerId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(timerId);
    }
  }
}
