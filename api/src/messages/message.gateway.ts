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
import { RoomsService } from 'src/rooms/rooms.service';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private messageService: MessagesService,
    private roomsService: RoomsService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async afterInit(server: Server) {
    console.log('WebSocket server initialized.');
  }

  async handleConnection(client: Socket) {
    // const user = await this.messageService.getUserFromSocket(client);
    // if (user !== undefined) console.log('user: ', user);
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() body: { roomId: string; content: string; parentId: number },
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('body: ', body);
    const { roomId, content, parentId } = body;
    const author = await this.messageService.getUserFromSocket(client);
    // console.log('author ', author);
    const message = await this.messageService.createMessage({
      authorId: author.id,
      roomId: roomId,
      content: content,
      parentId: parentId,
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

  @SubscribeMessage('remove_message')
  async handleRemoveMessage(
    @MessageBody() body: { roomId: string; messageId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { roomId, messageId } = body;
    const author = await this.messageService.getUserFromSocket(client);
    const softRemovedMessage = await this.messageService.softRemoveMessage({
      messageId,
      authorId: author.id,
    });

    // console.log('removed message: ', softRemovedMessage);

    this.server.to(roomId).emit('receive_message_removed', softRemovedMessage);
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
    const members = await this.roomsService.getRoomMembersById(roomId);
    // console.log('room: ', room);
    this.server.to(roomId).emit('joined_room', members);
    // console.log('join!');
  }

  @SubscribeMessage('leave_room')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { roomId: string },
  ) {
    const { roomId } = body;
    client.leave(roomId);
    const members = await this.roomsService.getRoomMembersById(roomId);
    this.server.to(roomId).emit('left_room', members);
    // console.log('left room from: ', roomId);
  }
}
