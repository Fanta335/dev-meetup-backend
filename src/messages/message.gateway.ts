import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private messageService: MessagesService) {}

  async afterInit(server: any) {
    console.log('WebSocket server initialized.');
  }

  async handleConnection(client: Socket) {
    const user = await this.messageService.getUserFromSocket(client);
    console.log(user);
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(content);
    const author = await this.messageService.getUserFromSocket(client);
    this.server.emit('recieve_message', { content, author });
  }

  @SubscribeMessage('messageToServer')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { content: string },
  ) {
    console.log('body', body);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joinRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
  }
}
