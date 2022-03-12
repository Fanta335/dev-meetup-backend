import { Message } from 'src/messages/entity/message.entity';
import { Photo } from 'src/photos/entity/photo.entity';
import { Room } from 'src/rooms/entity/room.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[];

  @ManyToMany(() => Room, (room) => room.owners)
  @JoinTable()
  myRooms: Room[];

  @ManyToMany(() => Room, (room) => room.members)
  @JoinTable()
  rooms: Room[];

  @CreateDateColumn()
  readonly createdAt: Date;

  @UpdateDateColumn()
  readonly updatedAt: Date;
}
