import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('send_message')
  listenForMessages(@MessageBody() data: string) {
    console.log(data);
    this.server.emit('recieve_message', data);
  }

  @SubscribeMessage('click')
  listenForClick(@MessageBody() data: string) {
    console.log(data);
    this.server.emit('recieve_message', data);
  }
}
