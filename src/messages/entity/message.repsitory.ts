import { CustomRepository } from 'src/database/typeorm-ex.decorator';
import { Message } from 'src/messages/entity/message.entity';
import { Repository } from 'typeorm';
import { CreateMessageDTO } from '../dto/createMessage.dto';

@CustomRepository(Message)
export class MessagesRepository extends Repository<Message> {
  createMessage({
    authorId,
    content,
    roomId,
    parentId,
  }: CreateMessageDTO): Promise<Message> {
    const message = new Message();
    message.authorId = authorId;
    message.roomId = roomId;
    message.content = content;
    message.parentId = parentId;

    return this.save(message);
  }

  getAllMessages(): Promise<Message[]> {
    return this.find();
  }

  getById(id: number): Promise<Message> {
    return this.findOne({ where: { id } });
  }

  getByRoomId(): Promise<Message[]> {
    return this.find({ relations: ['room'] });
  }

  getByAuthorId(): Promise<Message[]> {
    return this.find({ relations: ['user'] });
  }

  getLimitedMessages(roomId: number): Promise<Message[]> {
    return this.createQueryBuilder('message')
      .where('message.roomId = :roomId', { roomId })
      .orderBy('message.id', 'DESC')
      .take(5)
      .getMany();
  }
}
