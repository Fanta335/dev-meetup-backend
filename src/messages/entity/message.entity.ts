import { Room } from 'src/rooms/entity/room.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  authorId: number;

  @Column()
  roomId: number;

  @Column()
  content: string;

  @ManyToOne(() => Message, (message) => message.children, { nullable: true })
  parent: Message;

  @OneToMany(() => Message, (message) => message.parent, { nullable: true })
  children: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.messages, {
    cascade: true,
  })
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
}
