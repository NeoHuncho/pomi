// filepath: /Users/william/Documents/personal/pomi/packages/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { TimerModule } from './timer/timer.module';

@Module({
  imports: [TimerModule],
})
export class AppModule {}
