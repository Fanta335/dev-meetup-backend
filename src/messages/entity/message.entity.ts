import { Room } from 'src/rooms/entity/room.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity() // relationはあとで追記する
export class Message {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @ManyToOne(() => User, (user) => user.messages, { cascade: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ManyToOne(() => Room, (room) => room.messages, {
    cascade: true,
    onDelete: 'CASCADE', // roomが削除されたらmessageも削除される
  })
  @JoinColumn({
    name: 'roomId',
  })
  room: Room;

  @Column()
  content: string;

  @ManyToOne(() => Message, (message) => message.children, { nullable: true })
  parent: Message;

  @OneToMany(() => Message, (message) => message.parent, { nullable: true })
  children: Message[];

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
