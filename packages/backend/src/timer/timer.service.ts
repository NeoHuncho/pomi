// filepath: /Users/william/Documents/personal/pomi/packages/backend/src/timer/timer.service.ts
import { Injectable } from '@nestjs/common';
import { Timer } from '@pomi/shared/src/types';
import { Redis } from 'ioredis';
@Injectable()
export class TimerService {
  public redis: Redis;

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
      duration: 25 * 60 * 1000, // 25 minutes
      type: 'work',
      status: 'running',
    };

    await this.redis.set('current_timer', JSON.stringify(timer));
    return timer;
  }

  async pauseTimer(): Promise<Timer | null> {
    const timerStr = await this.redis.get('current_timer');
    if (!timerStr) return null;

    const timer: Timer = JSON.parse(timerStr);
    timer.status = 'paused';

    await this.redis.set('current_timer', JSON.stringify(timer));
    return timer;
  }
}
