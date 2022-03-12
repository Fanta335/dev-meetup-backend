import { Message } from '../entity/message.entity';

export class CreateMessageDTO {
  content: string;

  parent: Message;
}
