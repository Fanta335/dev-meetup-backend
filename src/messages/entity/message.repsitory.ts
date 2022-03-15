import { Message } from 'src/messages/entity/message.entity';
import { Room } from 'src/rooms/entity/room.entity';
import { User } from 'src/users/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateMessageDTO } from '../dto/createMessage.dto';

@EntityRepository(Message)
export class MessagesRepository extends Repository<Message> {
  createMessage(
    { content }: CreateMessageDTO,
    user: User,
    room: Room,
  ): Promise<Message> {
    const message = new Message();
    message.authorId = user.id;
    message.roomId = room.id;
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
