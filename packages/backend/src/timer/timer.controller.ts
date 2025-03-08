import { Controller, Get } from '@nestjs/common';
import { Timer } from '@pomi/shared/src/types';
import { TimerService } from './timer.service';

@Controller('timer')
export class TimerController {
  constructor(private timerService: TimerService) {}

  @Get()
  async getCurrentTimer(): Promise<Timer | null> {
    const timerStr = await this.timerService.redis.get('current_timer');
    return timerStr ? JSON.parse(timerStr) : null;
  }
}
