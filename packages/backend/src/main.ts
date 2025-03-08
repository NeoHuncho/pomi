import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));
  console.log('running on port', process.env.NEST_PORT);
  await app.listen(process.env.NEST_PORT || 3001);
}
bootstrap();
