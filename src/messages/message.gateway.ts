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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async afterInit(server: Server) {
    console.log('WebSocket server initialized.');
  }

  async handleConnection(client: Socket) {
    const user = await this.messageService.getUserFromSocket(client);
    if (user !== undefined) console.log('user: ', user);
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() body: { roomId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('body: ', body);
    const { roomId, content } = body;
    const author = await this.messageService.getUserFromSocket(client);
    // console.log('author ', author);
    const message = await this.messageService.createMessage({
      authorId: author.id,
      roomId: Number(roomId),
      content: content,
    });
    // console.log('saved message: ', message);
    this.server.to(roomId).emit('receive_message', message);
  }

  @SubscribeMessage('update_message')
  async handleUpdateMessage(
    @MessageBody() body: { roomId: string; messageId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, messageId, content } = body;
    const author = await this.messageService.getUserFromSocket(client);
    const updatedMessage = await this.messageService.updateMessage({
      messageId,
      authorId: author.id,
      content,
    });

    this.server.to(roomId).emit('receive_message', updatedMessage);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { roomId: string },
  ) {
    // console.log('join room body', body);
    const { roomId } = body;
    client.join(roomId);
    // console.log('rooms: ', client.rooms);
    this.server.to(roomId).emit('joined_room', roomId);
    // console.log('join!');
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { roomId: string },
  ) {
    const { roomId } = body;
    client.leave(roomId);
    this.server.to(roomId).emit('left_room', roomId);
    // console.log('left room from: ', roomId);
  }
}
