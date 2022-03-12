import { Message } from 'src/messages/entity/message.entity';
import { User } from 'src/users/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMessageDTO } from '../dto/createMessage.dto';

@EntityRepository(Message)
export class MessagesRepository extends Repository<Message> {
  createMessage(
    { content, parent = null }: CreateMessageDTO,
    user: User,
  ): Promise<Message> {
    const message = new Message();
    message.content = content;
    message.author = user;
    message.parent = parent;

    return this.manager.save(message);
  }

  findAll(): Promise<Message[]> {
    return this.find();
  }
}
