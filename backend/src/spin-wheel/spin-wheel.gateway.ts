import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SpinWheelGateway {
  @WebSocketServer()
  server: Server;

  userJoined(userId: number) {
    this.server.emit('USER_JOINED', { userId });
  }

  userEliminated(userId: number) {
    this.server.emit('USER_ELIMINATED', { userId });
  }

  winnerDeclared(userId: number, amount: number) {
    this.server.emit('WINNER_DECLARED', {
      userId,
      amount,
    });
  }
}
