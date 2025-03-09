import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TimerService } from './timer.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/',
  path: '/socket.io',
})
export class TimerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private timerService: TimerService) {
    // Send timer updates to all clients every second
    setInterval(async () => {
      const timerStr = await this.timerService.redis.get('current_timer');
      if (timerStr) {
        const timer = JSON.parse(timerStr);
        this.server.emit('timerUpdate', timer);
      }
    }, 1000);
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('startTimer')
  async handleStartTimer(client: Socket) {
    const timer = await this.timerService.startTimer();
    this.server.emit('timerUpdate', timer);
  }

  @SubscribeMessage('pauseTimer')
  async handlePauseTimer(client: Socket) {
    const timer = await this.timerService.pauseTimer();
    this.server.emit('timerUpdate', timer);
  }
}
