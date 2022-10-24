import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  authorId: number;

  @ApiProperty()
  @Column('varchar', { length: 36 })
  roomId: string;

  @ApiProperty()
  @Column('varchar', { length: 4000 })
  content: string;

  @ApiProperty()
  @Column({ nullable: true })
  parentId: number;

  @ApiProperty()
  @ManyToOne(() => Message, (message) => message.children, { nullable: true })
  parent: Message;

  @ApiProperty()
  @OneToMany(() => Message, (message) => message.parent, { nullable: true })
  children: Message[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @DeleteDateColumn()
  deletedAt: Date;

  @ApiProperty()
  @ManyToOne(() => User, (user) => user.messages, {
    cascade: true,
  })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @ApiProperty()
  @ManyToOne(() => Room, (room) => room.messages)
  @JoinColumn({
    name: 'roomId',
  })
  room: Room;
}
