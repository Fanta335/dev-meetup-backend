import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  GetJwtFromWsClient,
  GetWsData,
} from 'src/users/get-access-token.decorator';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;

  constructor(private messageService: MessagesService) {}

  async handleConnection(@GetJwtFromWsClient() token: string) {
    const user = await this.messageService.getUserFromSocketJwt(token);
    console.log(user);
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @GetJwtFromWsClient() token: string,
  ) {
    console.log(content);
    const author = await this.messageService.getUserFromSocketJwt(token);
    this.server.emit('recieve_message', { content, author });
  }

  @SubscribeMessage('click')
  listenForClick(@MessageBody() data: string, @GetWsData() wsData: any) {
    console.log(data);
    console.log(wsData);
    this.server.emit('recieve_message', data);
  }
}
