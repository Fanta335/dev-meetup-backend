import { Message } from 'src/messages/entity/message.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.myRooms)
  owners: User[];

  @ManyToMany(() => User, (user) => user.rooms)
  members: User[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];

  @OneToMany(() => User, (user) => user.id)
  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
