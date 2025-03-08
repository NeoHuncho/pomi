import { Module } from '@nestjs/common';
import { TimerController } from './timer.controller';
import { TimerGateway } from './timer.gateway';
import { TimerService } from './timer.service';

@Module({
  providers: [TimerService, TimerGateway],
  controllers: [TimerController],
})
export class TimerModule {}
