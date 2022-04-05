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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => User, (user) => user.myRooms, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owners: User[];

  @ManyToMany(() => User, (user) => user.rooms, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  members: User[];

  @OneToMany(() => Message, (message) => message.room)
  messages: Message[];
}
