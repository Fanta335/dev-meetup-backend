import { Message } from 'src/messages/entity/message.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMessageDTO } from '../dto/createMessage.dto';

@EntityRepository(Message)
export class MessagesRepository extends Repository<Message> {
  createMessage({
    authorId,
    content,
    roomId,
  }: CreateMessageDTO): Promise<Message> {
    const message = new Message();
    message.authorId = authorId;
    message.roomId = roomId;
    message.content = content;

    return this.save(message);
  }

  getAllMessages(): Promise<Message[]> {
    return this.find();
  }

  getByRoomId(): Promise<Message[]> {
    return this.find({ relations: ['room'] });
  }

  getByAuthorId(): Promise<Message[]> {
    return this.find({ relations: ['user'] });
  }
}
