import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMessageDTO } from '../dto/createMessage.dto';

@EntityRepository(Message)
export class MessagesRepository extends Repository<Message> {
  createMessage(
    { content, parentMessageId = null }: CreateMessageDTO,
    user: User,
  ): Promise<Message> {
    const message = new Message();
    message.content = content;
    message.authorId = user.id;
    message.parentMessageId = parentMessageId;

    return this.manager.save(message);
  }

  findAll(): Promise<Message[]> {
    return this.find();
  }
}
