import { Message } from 'src/messages/entity/message.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ownersId: number[];

  @Column()
  membersId: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => User, (user) => user.myRooms)
  owners: User[];

  @ManyToMany(() => User, (user) => user.rooms)
  members: User[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
